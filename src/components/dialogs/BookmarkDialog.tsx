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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Delete,
  Search,
  Description,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BookmarkItem {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  position: number;
}

interface BookmarkDialogProps {
  open: boolean;
  onClose: () => void;
}

export const BookmarkDialog = ({ open, onClose }: BookmarkDialogProps) => {
  // 模拟书签数据
  const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([
    {
      id: '1',
      title: '重要段落',
      excerpt: '这是一段需要重点关注的内容...',
      createdAt: new Date(2024, 2, 15),
      position: 1200,
    },
    {
      id: '2',
      title: '待办事项',
      excerpt: '需要后续跟进的任务列表...',
      createdAt: new Date(2024, 2, 14),
      position: 2400,
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      setBookmarks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleClick = (bookmark: BookmarkItem) => {
    console.log('Navigating to bookmark:', bookmark);
    onClose();
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            书签
          </Typography>
          <TextField
            size="small"
            placeholder="搜索书签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {filteredBookmarks.length === 0 ? (
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
            <BookmarkBorder sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography>没有找到书签</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredBookmarks.map((bookmark) => (
              <ListItem
                key={bookmark.id}
                disablePadding
                sx={{
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <ListItemButton
                  onClick={() => handleClick(bookmark)}
                  sx={{
                    py: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Bookmark color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={bookmark.title}
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 1,
                          }}
                        >
                          {bookmark.excerpt}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Description fontSize="small" />
                          {format(bookmark.createdAt, 'PPP', { locale: zhCN })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="删除书签">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(bookmark.id)}
                        sx={{
                          '&:hover': {
                            color: 'error.main',
                          },
                        }}
                      >
                        <Delete />
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