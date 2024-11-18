import { Link as LinkIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, text: string) => void;
}

export const LinkDialog = ({ open, onClose, onConfirm }: LinkDialogProps) => {
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
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            插入链接
          </Typography>
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
          sx={{
            mt: 2,
            '& .MuiInputLabel-root': {
              color: 'text.secondary',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
            },
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
          label={
            <Typography color="text.primary">
              自定义链接文字
            </Typography>
          }
          sx={{ mt: 2 }}
        />

        {useCustomText && (
          <TextField
            fullWidth
            label="链接文字"
            placeholder="请输入显示的文字"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          color="inherit"
          sx={{ color: 'text.primary' }}
        >
          取消
        </Button>
        <Button 
          variant="contained"
          onClick={handleConfirm}
          disabled={!canSubmit}
          color="primary"
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 