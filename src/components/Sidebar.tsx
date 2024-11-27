import { Bookmark as BookmarkType } from '@/types/bookmark';
import { exportFile, handleExport, parseImportedContent } from '@/utils/file-utils';
import {
  Bookmark,
  CloudDownload,
  CloudUpload,
  GitHub,
  Settings
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import React from 'react';
import { Descendant, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { AboutDialog } from './dialogs/AboutDialog';
import { BookmarkDialog } from './dialogs/BookmarkDialog';
import { ExportDialog } from './dialogs/ExportDialog';
import { ImportDialog } from './dialogs/ImportDialog';
import { SettingsDialog } from './dialogs/SettingsDialog';

const DRAWER_WIDTH = 280;

const styles = stylex.create({
  drawer: {
    width: `${DRAWER_WIDTH}px`,
    flexShrink: 0,
  },
  drawerPaper: {
    width: `${DRAWER_WIDTH}px`,
    borderRight: '1px solid var(--divider)',
    backgroundColor: 'var(--background-paper)',
    transition: 'box-shadow 0.3s ease-in-out',
    ':hover': {
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    },
  },
  listItem: {
    margin: '4px 8px',
    borderRadius: '12px',
    transition: 'all 0.2s ease-in-out',
    ':hover': {
      backgroundColor: 'var(--background-hover)',
      transform: 'translateX(4px)',
    },
  },
  listItemIcon: {
    color: 'var(--text-primary)',
    minWidth: '40px',
    transition: 'transform 0.2s ease',
  },
  listItemText: {
    color: 'var(--text-primary)',
    transition: 'color 0.2s ease',
  },
  divider: {
    margin: '12px 0',
    opacity: 0.6,
  },
});

interface SidebarProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Sidebar = ({ editor, setValue }: SidebarProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(true);
  const [aboutDialogOpen, setAboutDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = React.useState(false);
  const [bookmarks, setBookmarks] = React.useState<BookmarkType[]>([]);

  const handleImport = async (file: File) => {
    try {
      const newValue = await parseImportedContent(file);
      
      if (newValue.length === 0) {
        newValue.push({
          type: 'paragraph',
          children: [{ text: '' }],
        });
      }
      
      setValue(newValue);
      setImportDialogOpen(false);
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  const handleExportFormat = async (format: 'txt' | 'md' | 'json' | 'docx') => {
    try {
      const result = await handleExport(editor.children, format);
      await exportFile(result.content, result.filename);
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleSelectBookmark = (bookmark: BookmarkType) => {
    console.log('Selected bookmark:', bookmark);
    setBookmarkDialogOpen(false);
  };

  return (
    <>
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        {...stylex.props(styles.drawer)}
        PaperProps={{
          sx: {
            top: { xs: 56, sm: 64 },
            height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' },
            padding: '12px 0',
            backgroundImage: theme.palette.mode === 'dark' 
              ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
              : 'linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.01))',
          },
          ...stylex.props(styles.drawerPaper),
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setBookmarkDialogOpen(true)}
              sx={{
                '&:hover .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
              {...stylex.props(styles.listItem)}
            >
              <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                <Bookmark />
              </ListItemIcon>
              <ListItemText 
                primary="书签"
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider {...stylex.props(styles.divider)} />
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setImportDialogOpen(true)}
              sx={{
                '&:hover .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
              {...stylex.props(styles.listItem)}
            >
              <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                <CloudUpload />
              </ListItemIcon>
              <ListItemText 
                primary="导入"
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setExportDialogOpen(true)}
              sx={{
                '&:hover .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
              {...stylex.props(styles.listItem)}
            >
              <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                <CloudDownload />
              </ListItemIcon>
              <ListItemText 
                primary="导出"
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setSettingsDialogOpen(true)}
              sx={{
                '&:hover .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
              {...stylex.props(styles.listItem)}
            >
              <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                <Settings />
              </ListItemIcon>
              <ListItemText 
                primary="设置"
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => setAboutDialogOpen(true)}
              sx={{
                '&:hover .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
              }}
              {...stylex.props(styles.listItem)}
            >
              <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                <GitHub />
              </ListItemIcon>
              <ListItemText 
                primary="关于"
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <AboutDialog
        open={aboutDialogOpen}
        onClose={() => setAboutDialogOpen(false)}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
      />
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImport}
      />
      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExportFormat}
      />
      <BookmarkDialog
        open={bookmarkDialogOpen}
        onClose={() => setBookmarkDialogOpen(false)}
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
        onSelectBookmark={handleSelectBookmark}
      />
    </>
  );
}; 