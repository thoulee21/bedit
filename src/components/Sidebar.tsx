import {
  BookmarkBorder,
  ChevronLeft,
  CloudDownload,
  CloudUpload,
  Description,
  Folder,
  History,
  Info,
  Menu as MenuIcon,
  Settings
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';
import { Descendant, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { SettingsDialog } from './dialogs/SettingsDialog';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  type?: 'divider';
}

export const Sidebar = ({  }: SidebarProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(!isSmallScreen);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [recentDocsOpen, setRecentDocsOpen] = React.useState(false);
  const [folderOpen, setFolderOpen] = React.useState(false);
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(!isSmallScreen);
  }, [isSmallScreen]);

  const menuItems: (MenuItem | { type: 'divider' })[] = [
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

  const handleItemClick = (item: MenuItem | { type: 'divider' }) => {
    if ('onClick' in item) {
      item.onClick();
      if (isSmallScreen) {
        setOpen(false);
      }
    }
  };

  return (
    <>
      {/* 折叠按钮 */}
      <Box
        sx={{
          position: 'fixed',
          left: open ? DRAWER_WIDTH : 0,
          top: 64,
          zIndex: 1300,
          transition: theme.transitions.create(['left'], {
            duration: 0.15,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }),
        }}
      >
        <Tooltip title={open ? '收起菜单' : '展开菜单'} placement="right">
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: '0 8px 8px 0',
              boxShadow: theme.shadows[2],
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              width: 24,
              height: 48,
              '& .MuiSvgIcon-root': {
                fontSize: 20,
              },
            }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 侧边栏 */}
      <Drawer
        variant={isSmallScreen ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            top: 64,
            height: 'calc(100% - 64px)',
            backgroundColor: 'background.paper',
          },
        }}
      >
        <List>
          {menuItems.map((item, index) =>
            item.type === 'divider' ? (
              <Divider key={index} sx={{ my: 1 }} />
            ) : (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>

      {/* 对话框 */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      {/* ... 其他对话框 */}
    </>
  );
}; 