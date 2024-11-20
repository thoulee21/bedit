import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { Delete, BookmarkBorder } from '@mui/icons-material';
import { Bookmark } from '@/types/bookmark';

interface BookmarkDialogProps {
  open: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onDeleteBookmark: (id: string) => void;
  onSelectBookmark: (bookmark: Bookmark) => void;
}

export const BookmarkDialog: React.FC<BookmarkDialogProps> = ({
  open,
  onClose,
  bookmarks,
  onDeleteBookmark,
  onSelectBookmark,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>书签</DialogTitle>
      <DialogContent>
        {bookmarks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <BookmarkBorder sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              暂无书签
            </Typography>
          </Box>
        ) : (
          <List>
            {bookmarks.map((bookmark, index) => (
              <React.Fragment key={bookmark.id}>
                <ListItem button onClick={() => onSelectBookmark(bookmark)}>
                  <ListItemText
                    primary={bookmark.title}
                    secondary={new Date(bookmark.timestamp).toLocaleString()}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteBookmark(bookmark.id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < bookmarks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 