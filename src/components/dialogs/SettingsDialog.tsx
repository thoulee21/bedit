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
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { MaterialUISwitch } from '../MaterialUISwitch';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDarkMode } from '@/store/preferencesSlice';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);

  const settings = [
    {
      title: '暗色模式',
      description: '切换深色/浅色主题',
      control: (
        <MaterialUISwitch
          checked={prefersDarkMode}
          onChange={() => dispatch(toggleDarkMode())}
        />
      ),
    },
    // ... 其他设置项
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
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings color="primary" />
          <Typography variant="h6" color="primary" fontWeight={600}>
            设置
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {settings.map((setting, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1.5,
                borderBottom: index < settings.length - 1 ? 1 : 0,
                borderColor: 'divider',
              }}
            >
              <ListItemText
                primary={setting.title}
                secondary={setting.description}
                primaryTypographyProps={{
                  color: 'text.primary',
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  color: 'text.secondary',
                }}
              />
              <ListItemSecondaryAction>
                {setting.control}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 