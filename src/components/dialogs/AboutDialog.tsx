import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';
import React from 'react';
import packageJson from '../../../package.json';

interface AboutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = (
  { open, onClose }
) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>关于 BEdit</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          BEdit 是一个基于 Web 的富文本编辑器。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          版本：{packageJson.version}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          <Link
            href={packageJson.homepage}
            target="_blank"
            rel="noopener"
          >
            GitHub 仓库
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}; 