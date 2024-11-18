import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import {
  Upload,
  Download,
  Description,
  Code,
  Image,
  TextSnippet,
} from '@mui/icons-material';
import { importFile, exportFile } from '@/utils/file-processor';

interface ImportExportDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'import' | 'export';
}

export const ImportExportDialog = ({ open, onClose, mode }: ImportExportDialogProps) => {
  const formats = [
    {
      id: 'txt',
      name: '纯文本文件',
      description: '.txt 格式',
      icon: <Description />,
      extensions: '.txt',
    },
    {
      id: 'md',
      name: 'Markdown 文件',
      description: '.md 格式',
      icon: <TextSnippet />,
      extensions: '.md',
    },
    {
      id: 'html',
      name: 'HTML 文件',
      description: '.html 格式',
      icon: <Code />,
      extensions: '.html',
    },
    {
      id: 'docx',
      name: 'Word 文档',
      description: '.docx 格式',
      icon: <Description />,
      extensions: '.docx',
    },
    {
      id: 'pdf',
      name: 'PDF 文档',
      description: '.pdf 格式',
      icon: <Description />,
      extensions: '.pdf',
    },
    {
      id: 'image',
      name: '图片文件',
      description: '.png, .jpg, .jpeg, .gif 格式',
      icon: <Image aria-label="图片格式图标" />,
      extensions: '.png,.jpg,.jpeg,.gif',
    },
  ];

  const handleFormatSelect = (format: string) => {
    if (mode === 'import') {
      // 触发文件选择
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = formats.find(f => f.id === format)?.extensions || '';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log('Importing file:', file);
          // TODO: 处理文件导入
        }
      };
      input.click();
    } else {
      // 处理导出
      console.log('Exporting as:', format);
      // TODO: 处理文件导出
    }
    onClose();
  };

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
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {mode === 'import' ? <Upload color="primary" /> : <Download color="primary" />}
          <Typography variant="h6">
            {mode === 'import' ? '导入文档' : '导出文档'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {formats.map((format) => (
            <ListItem key={format.id} disablePadding>
              <ListItemButton
                onClick={() => handleFormatSelect(format.id)}
                sx={{
                  py: 2,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main' }}>
                  {format.icon}
                </ListItemIcon>
                <ListItemText
                  primary={format.name}
                  secondary={format.description}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}; 