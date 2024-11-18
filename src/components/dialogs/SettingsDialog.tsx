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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { MaterialUISwitch } from '../MaterialUISwitch';
import { useContext } from 'react';
import { Preferences } from '@/app/PreferenceProvider';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const preferences = useContext(Preferences);

  const settings = [
    {
      title: '外观',
      items: [
        {
          name: '深色模式',
          description: '切换深色/浅色主题',
          control: (
            <MaterialUISwitch
              checked={preferences.prefersDarkMode}
              onChange={() => preferences.setPrefersDarkMode(!preferences.prefersDarkMode)}
            />
          ),
        },
      ],
    },
    {
      title: '编辑器',
      items: [
        {
          name: '自动保存',
          description: '每隔5分钟自动保存文档',
          control: (
            <Switch
              checked={true}
              onChange={() => {}}
            />
          ),
        },
        {
          name: '字体大小',
          description: '调整编辑器字体大小',
          control: (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={16}
                onChange={() => {}}
              >
                <MenuItem value={12}>12px</MenuItem>
                <MenuItem value={14}>14px</MenuItem>
                <MenuItem value={16}>16px</MenuItem>
                <MenuItem value={18}>18px</MenuItem>
                <MenuItem value={20}>20px</MenuItem>
              </Select>
            </FormControl>
          ),
        },
      ],
    },
  ];

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
      <DialogTitle>设置</DialogTitle>
      <DialogContent dividers>
        {settings.map((section, index) => (
          <Box key={section.title} sx={{ mb: index < settings.length - 1 ? 3 : 0 }}>
            <Typography variant="h6" gutterBottom color="primary">
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item, itemIndex) => (
                <ListItem
                  key={item.name}
                  sx={{
                    py: 1.5,
                    borderBottom: 
                      itemIndex < section.items.length - 1 
                        ? '1px solid'
                        : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                  <ListItemSecondaryAction>
                    {item.control}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 