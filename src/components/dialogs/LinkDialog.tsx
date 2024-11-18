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
  useMediaQuery,
} from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

interface LinkDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (url: string, text: string) => void;
}

export const LinkDialog = ({ open, onClose, onConfirm }: LinkDialogProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
      handleClose();
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
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? 0 : 2,
          margin: isSmallScreen ? 0 : undefined,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pt: isSmallScreen ? 2 : 0,
        }}>
          <LinkIcon color="primary" />
          <Typography variant="h6" color="primary" fontWeight={600}>
            插入链接
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 2,
        }}>
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
            size={isSmallScreen ? "medium" : undefined}
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
          />

          {useCustomText && (
            <TextField
              fullWidth
              label="链接文字"
              placeholder="请输入显示的文字"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              size={isSmallScreen ? "medium" : undefined}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        pb: isSmallScreen ? 4 : 2,
        gap: 1,
        flexDirection: isSmallScreen ? 'column' : 'row',
      }}>
        <Button 
          onClick={handleClose}
          fullWidth={isSmallScreen}
          size={isSmallScreen ? "large" : undefined}
        >
          取消
        </Button>
        <Button 
          variant="contained"
          onClick={handleConfirm}
          disabled={!canSubmit}
          fullWidth={isSmallScreen}
          size={isSmallScreen ? "large" : undefined}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 