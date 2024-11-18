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
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description,
  Folder,
  Settings,
  Info,
  GitHub,
  BookmarkBorder,
  History,
  CloudUpload,
  CloudDownload,
} from '@mui/icons-material';
import { SettingsDialog } from './dialogs/SettingsDialog';
import { AboutDialog } from './dialogs/AboutDialog';
import { RecentDocsDialog } from './dialogs/RecentDocsDialog';

const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [recentDocsOpen, setRecentDocsOpen] = React.useState(false);

  const menuItems = [
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
      onClick: () => console.log('文件夹'),
    },
    {
      title: '书签',
      icon: <BookmarkBorder />,
      onClick: () => console.log('书签'),
    },
    { type: 'divider' },
    {
      title: '导入',
      icon: <CloudUpload />,
      onClick: () => console.log('导入'),
    },
    {
      title: '导出',
      icon: <CloudDownload />,
      onClick: () => console.log('导出'),
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
      {/* 折叠按钮 */}
      <Box
        sx={{
          position: 'fixed',
          left: open ? DRAWER_WIDTH : 0,
          top: 64,
          zIndex: 1200,
          transition: 'left 0.3s',
        }}
      >
        <Tooltip title={open ? '收起菜单' : '展开菜单'} placement="right">
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              backgroundColor: 'background.paper',
              borderRadius: '0 8px 8px 0',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <MenuIcon
              sx={{
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 侧边栏 */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
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
        <List sx={{ flex: 1 }}>
          {menuItems.map((item, index) =>
            item.type === 'divider' ? (
              <Divider key={index} sx={{ my: 1 }} />
            ) : (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={item.onClick}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>

        {/* 底部 */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="访问 GitHub">
              <IconButton
                component="a"
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Drawer>

      {/* 添加对话框 */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <AboutDialog
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
      <RecentDocsDialog
        open={recentDocsOpen}
        onClose={() => setRecentDocsOpen(false)}
      />
    </>
  );
}; 