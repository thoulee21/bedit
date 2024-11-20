import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onClose, onImport }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>导入文档</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: 3,
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept=".txt,.md,.json,.docx"
          />
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="body1">
            点击选择文件或拖拽文件到此处
          </Typography>
          <Typography variant="body2" color="text.secondary">
            支持的格式：TXT、Markdown、JSON、Word
          </Typography>
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
          >
            选择文件
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}; 