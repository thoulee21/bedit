import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import { TableChart, AccountTree, BarChart } from '@mui/icons-material';
import { mockVisualize } from '@/utils/visualizer-utils';

interface VisualizerDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export const VisualizerDialog: React.FC<VisualizerDialogProps> = ({
  open,
  onClose,
  onInsert,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // TODO: 调用大模型API生成可视化内容
      const result = await mockVisualize(activeTab, input);
      setResult(result);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>智能可视化</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<TableChart />} label="表格生成" />
          <Tab icon={<AccountTree />} label="思维导图" />
          <Tab icon={<BarChart />} label="数据可视化" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeTab === 0
                ? '请输入需要整理成表格的文本内容...'
                : activeTab === 1
                ? '请输入需要生成思维导图的文本内容...'
                : '请输入需要可视化的数据...'
            }
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : result ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                生成结果：
              </Typography>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
              <Button
                variant="contained"
                onClick={() => onInsert(result)}
                sx={{ mt: 1 }}
              >
                插入到编辑器
              </Button>
            </Box>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
        >
          生成
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 