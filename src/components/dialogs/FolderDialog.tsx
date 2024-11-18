import {
  ArrowBack,
  CreateNewFolder,
  Delete,
  Description,
  Folder,
  FolderOpen,
  NavigateNext,
  Search,
} from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React from 'react';

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  lastModified: Date;
  path: string[];
}

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
}

export const FolderDialog = ({ open, onClose }: FolderDialogProps) => {
  // 模拟文件夹数据
  const [items, setItems] = React.useState<FolderItem[]>([
    {
      id: '1',
      name: '工作文档',
      type: 'folder',
      lastModified: new Date(2024, 2, 15),
      path: ['工作文档'],
    },
    {
      id: '2',
      name: '个人笔记',
      type: 'folder',
      lastModified: new Date(2024, 2, 14),
      path: ['个人笔记'],
    },
    {
      id: '3',
      name: '项目计划书.txt',
      type: 'file',
      lastModified: new Date(2024, 2, 13),
      path: ['项目计划书.txt'],
    },
  ]);

  const [currentPath, setCurrentPath] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleNavigate = (item: FolderItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    } else {
      console.log('Opening file:', item);
      onClose();
    }
  };

  const handleBack = () => {
    setCurrentPath(prev => prev.slice(0, -1));
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
  };

  const handleCreateFolder = () => {
    const name = window.prompt('请输入文件夹名称:');
    if (name) {
      const newFolder: FolderItem = {
        id: Date.now().toString(),
        name,
        type: 'folder',
        lastModified: new Date(),
        path: [...currentPath, name],
      };
      setItems(prev => [...prev, newFolder]);
    }
  };

  const handleDelete = (item: FolderItem) => {
    if (window.confirm(`确定要删除 ${item.name} 吗？`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const filteredItems = items.filter(item => 
    item.path.length === currentPath.length + 1 &&
    item.path.slice(0, -1).every((p, i) => p === currentPath[i]) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={handleBack}
              disabled={currentPath.length === 0}
              size="small"
            >
              <ArrowBack />
            </IconButton>
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ flex: 1 }}
            >
              <Link
                component="button"
                variant="body1"
                onClick={() => setCurrentPath([])}
                underline="hover"
                color="inherit"
              >
                根目录
              </Link>
              {currentPath.map((path, index) => (
                <Link
                  key={path}
                  component="button"
                  variant="body1"
                  onClick={() => handleBreadcrumbClick(index)}
                  underline="hover"
                  color="inherit"
                >
                  {path}
                </Link>
              ))}
            </Breadcrumbs>
            <Tooltip title="新建文件夹">
              <IconButton onClick={handleCreateFolder} size="small">
                <CreateNewFolder />
              </IconButton>
            </Tooltip>
          </Stack>
          <TextField
            size="small"
            placeholder="搜索文件和文件夹..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        {filteredItems.length === 0 ? (
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
            <Typography>此文件夹为空</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredItems.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                secondaryAction={
                  <Tooltip title="删除">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDelete(item)}
                      sx={{
                        '&:hover': {
                          color: 'error.main',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  onClick={() => handleNavigate(item)}
                  sx={{
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.type === 'folder' ? (
                      <Folder color="primary" />
                    ) : (
                      <Description color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={format(item.lastModified, 'PPP', { locale: zhCN })}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}; 