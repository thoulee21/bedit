import React, { useState, Dispatch, SetStateAction } from 'react';
import { AppBar, Box, Toolbar, Stack, Divider, Typography, IconButton } from '@mui/material';
import { Editor, Descendant, BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { MaterialUISwitch } from './MaterialUISwitch';
import { createToolbarItems } from './toolbar-items';
import { Edit, FormatListBulleted, Chat as ChatIcon, Menu } from '@mui/icons-material';
import { LinkDialog } from './dialogs/LinkDialog';
import { TableDialog } from './dialogs/TableDialog';
import { insertLink, insertTable } from '@/utils/editor-utils';
import { toggleDarkMode } from '@/store/preferencesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  appBar: {
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--divider)',
    backgroundColor: 'var(--header-background)',
    zIndex: 1400,
  },
  toolbar: {
    display: 'flex',
    gap: '16px',
  },
  title: {
    color: 'var(--header-text)',
    fontWeight: 600,
  },
  toolbarContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    flex: 1,
  },
  toolbarItem: {
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
  mobileButton: {
    padding: '6px',
  },
  toolbarText: {
    color: 'var(--header-text)',
  },
  toolbarIcon: {
    color: 'var(--header-text)',
    opacity: 0.9,
    ':hover': {
      opacity: 1,
    },
  },
});

interface HeaderProps {
  editor: BaseEditor & ReactEditor & HistoryEditor;
  setValue: Dispatch<SetStateAction<any[]>>;
  onToggleOutline: () => void;
  onToggleChat: () => void;
  showOutline: boolean;
  showChat: boolean;
  isSmallScreen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  editor,
  setValue,
  onToggleOutline,
  onToggleChat,
  showOutline,
  showChat,
  isSmallScreen,
  setSidebarOpen,
  sidebarOpen,
  children,
}) => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);

  const toolbarEvents = {
    openLinkDialog: () => setLinkDialogOpen(true),
    openTableDialog: () => setTableDialogOpen(true),
  };

  const toolbarItems = createToolbarItems(editor, toolbarEvents);

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={0}
      {...stylex.props(styles.appBar)}
    >
      <Toolbar 
        variant="dense"
        {...stylex.props(styles.toolbar)}
        sx={{ minHeight: { xs: '56px', sm: '64px' } }}
      >
        <IconButton
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ marginRight: 1 }}
        >
          <Menu />
        </IconButton>

        <Stack direction="row" spacing={1} alignItems="center">
          <Edit 
            {...stylex.props(styles.toolbarIcon)}
            sx={{ fontSize: isSmallScreen ? 24 : 28 }} 
          />
          <Typography variant="h6" {...stylex.props(styles.title)}>
            BEdit
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

        <Stack
          direction="row"
          spacing={0.5}
          {...stylex.props(styles.toolbarContent)}
        >
          {toolbarItems.map((item) => 
            item.type === 'separator' ? (
              <Divider
                key={item.key}
                orientation="vertical"
                flexItem
                sx={{ 
                  mx: isSmallScreen ? 0.25 : 0.5,
                  borderColor: 'var(--divider)',
                }}
              />
            ) : (
              <IconButton
                key={item.key}
                size="small"
                onClick={item.onSelect}
                disabled={item.disabled}
                {...stylex.props(styles.toolbarItem, styles.toolbarIcon)}
                sx={{ 
                  padding: isSmallScreen ? '6px' : '8px',
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                  '&.MuiIconButton-colorPrimary': {
                    color: 'var(--primary-main)',
                  },
                }}
              >
                {item.icon}
              </IconButton>
            )
          )}
        </Stack>

        {isSmallScreen && (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              onClick={onToggleOutline}
              color={showOutline ? 'primary' : 'default'}
              size="small"
              {...stylex.props(styles.mobileButton)}
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
            <IconButton
              onClick={onToggleChat}
              color={showChat ? 'primary' : 'default'}
              size="small"
              {...stylex.props(styles.mobileButton)}
            >
              <ChatIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        <Box sx={{ ml: 'auto' }}>
          <MaterialUISwitch 
            checked={prefersDarkMode}
            onChange={() => dispatch(toggleDarkMode())}
            size={isSmallScreen ? "small" : "medium"}
          />
        </Box>

        <LinkDialog
          open={linkDialogOpen}
          onClose={() => setLinkDialogOpen(false)}
          onConfirm={(url, text) => {
            insertLink(editor, url, text);
            setLinkDialogOpen(false);
          }}
        />

        <TableDialog
          open={tableDialogOpen}
          onClose={() => setTableDialogOpen(false)}
          onConfirm={(rows, cols) => {
            insertTable(editor, rows, cols);
            setTableDialogOpen(false);
          }}
        />
      </Toolbar>
    </AppBar>
  );
};