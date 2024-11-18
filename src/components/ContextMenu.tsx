import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { createContextMenuItems } from './context-menu-items';
import { CustomEditor } from '@/types/slate';

interface ContextMenuProps {
  editor: CustomEditor;
  anchorPosition: { top: number; left: number } | null;
  onClose: () => void;
}

export const ContextMenu = ({ editor, anchorPosition, onClose }: ContextMenuProps) => {
  const menuItems = createContextMenuItems(editor);

  return (
    <Menu
      open={Boolean(anchorPosition)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ?? undefined}
      sx={{
        '& .MuiPaper-root': {
          minWidth: 200,
          boxShadow: theme => theme.shadows[3],
          borderRadius: 1,
        },
      }}
    >
      {menuItems.map(item => 
        item.type === 'separator' ? (
          <Divider key={item.key} sx={{ my: 0.5 }} />
        ) : (
          <MenuItem
            key={item.key}
            onClick={() => {
              item.onSelect?.();
              onClose();
            }}
            disabled={item.disabled}
            sx={{
              py: 1,
              px: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText 
              primary={item.title}
              primaryTypographyProps={{
                variant: 'body2',
              }}
            />
          </MenuItem>
        )
      )}
    </Menu>
  );
}; 