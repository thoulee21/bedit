import { Code, Description } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'txt' | 'md' | 'json' | 'docx') => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open, onClose, onExport
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>导出文档</DialogTitle>
      <DialogContent>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('txt')}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary="纯文本文档"
                secondary=".txt"
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('md')}>
              <ListItemIcon>
                <Code />
              </ListItemIcon>
              <ListItemText
                primary="Markdown 文档"
                secondary=".md"
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('docx')}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary="Word 文档"
                secondary=".docx"
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => onExport('json')}>
              <ListItemIcon>
                <Code />
              </ListItemIcon>
              <ListItemText
                primary="JSON 文档"
                secondary=".json"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}; 