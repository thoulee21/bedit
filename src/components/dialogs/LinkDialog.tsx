import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  useTheme,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, text: string) => void;
}

export const LinkDialog = ({ open, onClose, onConfirm }: LinkDialogProps) => {
  const theme = useTheme();
  const [url, setUrl] = React.useState('');
  const [linkText, setLinkText] = React.useState('');
  const [useCustomText, setUseCustomText] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleConfirm = () => {
    if (!url) {
      setError('请输入链接地址');
      return;
    }

    try {
      const urlToCheck = url.startsWith('http') ? url : `http://${url}`;
      new URL(urlToCheck);
      onConfirm(url, useCustomText && linkText ? linkText : url);
      setUrl('');
      setLinkText('');
      setError('');
      onClose();
    } catch {
      setError('请输入有效的链接地址');
    }
  };

  const handleClose = () => {
    setUrl('');
    setLinkText('');
    setError('');
    setUseCustomText(false);
    onClose();
  };

  const canSubmit = url.trim().length > 0 && (!useCustomText || linkText.trim().length > 0);

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" />
          <Typography variant="h6">插入链接</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="链接地址"
          placeholder="请输入链接地址"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) {
              e.preventDefault();
              handleConfirm();
            }
          }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={useCustomText}
              onChange={(e) => {
                setUseCustomText(e.target.checked);
                if (!e.target.checked) {
                  setLinkText('');
                }
              }}
            />
          }
          label="自定义链接文字"
          sx={{ mt: 2 }}
        />

        {useCustomText && (
          <TextField
            fullWidth
            label="链接文字"
            placeholder="请输入显示的文字"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{ mt: 2 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>取消</Button>
        <Button 
          variant="contained" 
          onClick={handleConfirm}
          disabled={!canSubmit}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 