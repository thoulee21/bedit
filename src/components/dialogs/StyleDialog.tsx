import type { StyleTemplate } from '@/types/style';
import { Check, Style } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import React from 'react';


interface StyleDialogProps {
  open: boolean;
  onClose: () => void;
  onApplyStyle: (style: StyleTemplate) => void;
}

const defaultTemplates: StyleTemplate[] = [
  {
    id: 'academic',
    name: '学术论文',
    styles: {
      'heading-one': { fontSize: '20pt', fontWeight: 'bold', marginBottom: '24px' },
      'heading-two': { fontSize: '16pt', fontWeight: 'bold', marginBottom: '16px' },
      'heading-three': { fontSize: '14pt', fontWeight: 'bold', marginBottom: '12px' },
      'paragraph': { fontSize: '12pt', lineHeight: 1.5, marginBottom: '12px' },
      'blockquote': {
        fontSize: '12pt',
        borderLeft: '4px solid #ccc',
        paddingLeft: '16px',
        marginLeft: '0',
        fontStyle: 'italic'
      },
    },
  },
  {
    id: 'report',
    name: '工作报告',
    styles: {
      'heading-one': { fontSize: '24pt', color: '#2196f3', marginBottom: '24px' },
      'heading-two': { fontSize: '18pt', color: '#1976d2', marginBottom: '16px' },
      'heading-three': { fontSize: '14pt', color: '#1565c0', marginBottom: '12px' },
      'paragraph': { fontSize: '11pt', lineHeight: 1.6, marginBottom: '12px' },
    },
  },
];

export const StyleDialog: React.FC<StyleDialogProps> = ({
  open,
  onClose,
  onApplyStyle,
}) => {
  const [templates, setTemplates] = React.useState(defaultTemplates);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleApply = () => {
    const selected = templates.find(t => t.id === selectedId);
    if (selected) {
      onApplyStyle(selected);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>排版样式</DialogTitle>
      <DialogContent>
        <List>
          {templates.map((template) => (
            <React.Fragment key={template.id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={template.id === selectedId}
                  onClick={() => setSelectedId(template.id)}
                >
                  <ListItemIcon>
                    <Style />
                  </ListItemIcon>
                  <ListItemText
                    primary={template.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        包含标题、正文等样式
                      </Typography>
                    }
                  />
                  {template.id === selectedId && (
                    <Check sx={{ ml: 1 }} />
                  )}
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleApply}
          disabled={!selectedId}
          variant="contained"
        >
          应用样式
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 