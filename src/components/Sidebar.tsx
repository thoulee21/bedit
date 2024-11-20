import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  History,
  Description,
  Folder,
  BookmarkBorder,
  CloudUpload,
  CloudDownload,
  Settings,
  Info,
} from '@mui/icons-material';
import { Editor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import * as stylex from '@stylexjs/stylex';

const DRAWER_WIDTH = 240;

const styles = stylex.create({
  toggleButton: {
    backgroundColor: 'var(--background-paper)',
    borderRadius: '0 8px 8px 0',
    width: '24px',
    height: '48px',
    transition: 'all 0.15s ease',
    ':hover': {
      backgroundColor: 'var(--background-hover)',
    },
  },
  toggleIcon: {
    fontSize: '20px',
    color: 'var(--text-primary)',
  },
  drawer: {
    width: `${DRAWER_WIDTH}px`,
    flexShrink: 0,
  },
  drawerPaper: {
    width: `${DRAWER_WIDTH}px`,
    borderRight: '1px solid var(--divider)',
    backgroundColor: 'var(--background-paper)',
  },
  listItem: {
    borderRadius: '8px',
    margin: '0 8px',
    ':hover': {
      backgroundColor: 'var(--background-hover)',
    },
  },
  listItemIcon: {
    color: 'var(--text-primary)',
    minWidth: '40px',
  },
  listItemText: {
    color: 'var(--text-primary)',
  },
  divider: {
    margin: '8px 0',
  },
});

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

type MenuItemOrDivider = MenuItem | { type: 'divider' };

interface SidebarProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Sidebar = ({ editor, setValue }: SidebarProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(true);
  
  const [recentDocsOpen, setRecentDocsOpen] = React.useState(false);
  const [folderOpen, setFolderOpen] = React.useState(false);
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const menuItems: MenuItemOrDivider[] = [
    {
      title: '最近文档',
      icon: <History />,
      onClick: () => setRecentDocsOpen(true),
    },
    {
      title: '我的文档',
      icon: <Description />,
      onClick: () => console.log('我的文档'),
    },
    {
      title: '文件夹',
      icon: <Folder />,
      onClick: () => setFolderOpen(true),
    },
    {
      title: '书签',
      icon: <BookmarkBorder />,
      onClick: () => setBookmarkOpen(true),
    },
    { type: 'divider' },
    {
      title: '导入',
      icon: <CloudUpload />,
      onClick: () => setImportOpen(true),
    },
    {
      title: '导出',
      icon: <CloudDownload />,
      onClick: () => setExportOpen(true),
    },
    { type: 'divider' },
    {
      title: '设置',
      icon: <Settings />,
      onClick: () => setSettingsOpen(true),
    },
    {
      title: '关于',
      icon: <Info />,
      onClick: () => setAboutOpen(true),
    },
  ];

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          left: open ? DRAWER_WIDTH : 0,
          top: { xs: 56, sm: 64 },
          zIndex: 1300,
          transition: theme => theme.transitions.create(['left'], {
            duration: 0.15,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }),
        }}
      >
        <Tooltip title={open ? '收起菜单' : '展开菜单'} placement="right">
          <IconButton
            onClick={() => setOpen(!open)}
            {...stylex.props(styles.toggleButton)}
          >
            {open ? (
              <ChevronLeft {...stylex.props(styles.toggleIcon)} />
            ) : (
              <MenuIcon {...stylex.props(styles.toggleIcon)} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

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
          },
          ...stylex.props(styles.drawerPaper),
        }}
      >
        <List>
          {menuItems.map((item, index) =>
            'type' in item ? (
              <Divider key={`divider-${index}`} {...stylex.props(styles.divider)} />
            ) : (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => {
                    item.onClick();
                    if (isSmallScreen) {
                      setOpen(false);
                    }
                  }}
                  {...stylex.props(styles.listItem)}
                >
                  <ListItemIcon {...stylex.props(styles.listItemIcon)}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    {...stylex.props(styles.listItemText)}
                  />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </>
  );
}; 