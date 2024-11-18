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
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Description,
  DeleteOutline,
  AccessTime,
  FolderOpen,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface RecentDoc {
  id: string;
  title: string;
  path: string;
  lastOpened: Date;
}

interface RecentDocsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const RecentDocsDialog = ({ open, onClose }: RecentDocsDialogProps) => {
  // 模拟最近文档数据
  const [recentDocs, setRecentDocs] = React.useState<RecentDoc[]>([
    {
      id: '1',
      title: '项目计划书.txt',
      path: '/documents/项目计划书.txt',
      lastOpened: new Date(2024, 2, 15, 14, 30),
    },
    {
      id: '2',
      title: '会议记录.md',
      path: '/documents/会议记录.md',
      lastOpened: new Date(2024, 2, 14, 10, 15),
    },
    {
      id: '3',
      title: '技术文档.txt',
      path: '/documents/技术文档.txt',
      lastOpened: new Date(2024, 2, 13, 16, 45),
    },
  ]);

  const handleDelete = (id: string) => {
    setRecentDocs(docs => docs.filter(doc => doc.id !== id));
  };

  const handleOpen = (doc: RecentDoc) => {
    console.log('Opening document:', doc);
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
      <DialogTitle>最近文档</DialogTitle>
      <DialogContent dividers>
        {recentDocs.length === 0 ? (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              color: 'text.secondary',
            }}
          >
            <FolderOpen sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography>没有最近打开的文档</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recentDocs.map((doc, index) => (
              <ListItem
                key={doc.id}
                disablePadding
                divider={index < recentDocs.length - 1}
              >
                <ListItemButton
                  onClick={() => handleOpen(doc)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {format(doc.lastOpened, 'PPP p', { locale: zhCN })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="从列表中移除">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(doc.id)}
                        sx={{
                          '&:hover': {
                            color: 'error.main',
                          },
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}; 