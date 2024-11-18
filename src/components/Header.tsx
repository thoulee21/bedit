import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDarkMode } from '@/store/preferencesSlice';
import { insertLink, insertTable } from '@/utils/editor-utils';
import { Edit } from '@mui/icons-material';
import { AppBar, Box, Divider, IconButton, Stack, Toolbar } from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Descendant, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { LinkDialog } from './dialogs/LinkDialog';
import { TableDialog } from './dialogs/TableDialog';
import { MaterialUISwitch } from './MaterialUISwitch';
import { createToolbarItems } from './toolbar-items';

const styles = stylex.create({
  appBar: {
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--divider-color)',
    zIndex: 1300,
  },
  darkAppBar: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  lightAppBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  toolbar: {
    minHeight: '64px',
    display: 'flex',
    gap: '16px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--primary-color)',
    fontWeight: 600,
  },
  toolbarContent: {
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
});

interface HeaderProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Header = ({ editor }: HeaderProps) => {
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
      {...stylex.props(
        styles.appBar,
        prefersDarkMode ? styles.darkAppBar : styles.lightAppBar
      )}
    >
      <Toolbar variant="dense" {...stylex.props(styles.toolbar)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Edit color="primary" sx={{ fontSize: 28 }} />
          <div {...stylex.props(styles.title)}>BEdit</div>
        </Stack>

        <Divider orientation="vertical" flexItem />

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
                sx={{ mx: 0.5 }}
              />
            ) : (
              <IconButton
                key={item.key}
                size="small"
                onClick={item.onSelect}
                disabled={item.disabled}
                color={item.active ? 'primary' : 'default'}
                {...stylex.props(styles.toolbarItem)}
              >
                {item.icon}
              </IconButton>
            )
          )}
        </Stack>

        <Box sx={{ ml: 'auto' }}>
          <MaterialUISwitch
            checked={prefersDarkMode}
            onChange={() => dispatch(toggleDarkMode())}
          />
        </Box>
      </Toolbar>

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
    </AppBar>
  );
};