import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { GitHub } from '@mui/icons-material';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>关于</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
            BEdit
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            版本 1.3.3
          </Typography>
        </Box>
        <Typography paragraph>
          BEdit 是一个现代化的富文本编辑器，基于 React 和 Slate.js 构建。它提供了丰富的编辑功能和优雅的用户界面。
        </Typography>
        <Typography paragraph>
          主要特性：
        </Typography>
        <ul>
          <Typography component="li">所见即所得的编辑体验</Typography>
          <Typography component="li">支持 Markdown 语法</Typography>
          <Typography component="li">实时大纲预览</Typography>
          <Typography component="li">AI 助手支持</Typography>
          <Typography component="li">深色模式</Typography>
        </ul>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            href="https://github.com/yourusername/bedit"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <GitHub />
            <Typography>访问 GitHub</Typography>
          </Link>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 