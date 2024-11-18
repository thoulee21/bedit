import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { ToolbarItem } from './toolbar-items';

interface MoreToolsMenuProps {
  tools: ToolbarItem[];
}

export const MoreToolsMenu = ({ tools }: MoreToolsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (onSelect: (() => void) | undefined) => {
    if (onSelect) {
      onSelect();
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="更多工具">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: '6px' }}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 200,
          },
        }}
      >
        {tools.map((tool) => (
          <MenuItem
            key={tool.key}
            onClick={() => tool.onSelect && handleItemClick(tool.onSelect)}
            disabled={tool.disabled}
            sx={{
              color: tool.active ? 'primary.main' : 'text.primary',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {tool.icon}
            </ListItemIcon>
            <ListItemText>{tool.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}; 