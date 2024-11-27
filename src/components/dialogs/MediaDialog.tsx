import React, { useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Image, Audiotrack, PictureAsPdf } from '@mui/icons-material';
import { mockOCR, mockASR, extractPDFText } from '@/utils/media-utils';

interface MediaDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
}

export const MediaDialog: React.FC<MediaDialogProps> = ({
  open,
  onClose,
  onInsert,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setLoading(true);
    try {
      const file = acceptedFiles[0];
      let text = '';

      if (file.type.startsWith('image/')) {
        text = await mockOCR(file);
      } else if (file.type.startsWith('audio/')) {
        text = await mockASR(file);
      } else if (file.type === 'application/pdf') {
        text = await extractPDFText(file);
      }

      setResult(text);
    } catch (error) {
      console.error('处理文件失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: activeTab === 0
      ? { 'image/*': ['.jpg', '.jpeg', '.png'] }
      : activeTab === 1
        ? { 'audio/*': ['.mp3', '.wav'] }
        : { 'application/pdf': ['.pdf'] },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>多媒体信息提取</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={
          (_, v) => setActiveTab(v)
        }>
          <Tab icon={<Image />} label="图片识别" />
          <Tab icon={<Audiotrack />} label="语音识别" />
          <Tab icon={<PictureAsPdf />} label="PDF提取" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : result ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                识别结果：
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
              <Button onClick={() => onInsert(result)}>
                插入到编辑器
              </Button>
            </Box>
          ) : (
            <Box
              {...getRootProps()}
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                borderRadius: 1,
                textAlign: 'center',
                cursor: 'pointer',
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                {isDragActive
                  ? '放开以上传文件'
                  : '点击或拖拽文件到此处上传'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {activeTab === 0
                  ? '支持的格式：JPG、PNG'
                  : activeTab === 1
                    ? '支持的格式：MP3、WAV'
                    : '支持的格式：PDF'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {result && (
          <Button onClick={() => {
            setResult('');
            setActiveTab(0);
          }}>
            重新上传
          </Button>
        )}
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 