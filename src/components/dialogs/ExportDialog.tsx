import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Description, Code } from '@mui/icons-material';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: 'txt' | 'md' | 'json' | 'docx') => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose, onExport }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>导出文档</DialogTitle>
      <DialogContent>
        <List>
          <ListItem button onClick={() => onExport('txt')}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText 
              primary="纯文本文档" 
              secondary=".txt"
            />
          </ListItem>
          <ListItem button onClick={() => onExport('md')}>
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText 
              primary="Markdown 文档" 
              secondary=".md"
            />
          </ListItem>
          <ListItem button onClick={() => onExport('docx')}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText 
              primary="Word 文档" 
              secondary=".docx"
            />
          </ListItem>
          <ListItem button onClick={() => onExport('json')}>
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText 
              primary="JSON 文档" 
              secondary=".json"
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
}; 