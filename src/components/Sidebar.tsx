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
  useTheme,
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
import { FolderDialog } from './dialogs/FolderDialog';
import { BookmarkDialog } from './dialogs/BookmarkDialog';
import { ImportExportDialog } from './dialogs/ImportExportDialog';

const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [recentDocsOpen, setRecentDocsOpen] = React.useState(false);
  const [folderOpen, setFolderOpen] = React.useState(false);
  const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

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
            <MenuIcon
              sx={{
                transform: open ? 'rotate(180deg)' : 'none',
                transition: theme.transitions.create('transform', {
                  duration: 0.15,
                  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }),
                color: theme.palette.text.primary,
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
          position: 'fixed',
          zIndex: 1300,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            top: 64,
            bottom: 0,
            height: 'auto',
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: open ? theme.shadows[8] : 'none',
            transform: open ? 'none' : `translateX(-${DRAWER_WIDTH}px)`,
            transition: theme.transitions.create(['transform', 'box-shadow'], {
              duration: 0.15,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }),
          },
        }}
      >
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <List>
            {menuItems.map((item, index) =>
              item.type === 'divider' ? (
                <Divider key={index} sx={{ my: 1 }} />
              ) : (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        color: 'primary.main',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'inherit',
                      },
                    }}
                    onClick={item.onClick}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 40,
                      color: theme.palette.text.primary,
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title}
                      sx={{
                        '& .MuiTypography-root': {
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>

        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="访问 GitHub">
              <IconButton
                component="a"
                href="https://github.com/yourusername/yourrepo"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.text.primary,
                  transition: 'color 0.15s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <GitHub />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Drawer>

      {/* 遮罩层 */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1100,
            opacity: 1,
            transition: 'opacity 0.15s ease',
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* 对话框 */}
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
      <FolderDialog
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
      />
      <BookmarkDialog
        open={bookmarkOpen}
        onClose={() => setBookmarkOpen(false)}
      />
      <ImportExportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        mode="import"
      />
      <ImportExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        mode="export"
      />
    </>
  );
}; 