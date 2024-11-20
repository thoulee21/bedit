import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDarkMode } from '@/store/preferencesSlice';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={prefersDarkMode}
              onChange={() => dispatch(toggleDarkMode())}
            />
          }
          label="暗色模式"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 