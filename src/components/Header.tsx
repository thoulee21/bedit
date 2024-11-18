import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleDarkMode } from '@/store/preferencesSlice'
import { insertLink, insertTable } from '@/utils/editor-utils'
import { Edit } from '@mui/icons-material'
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Tooltip, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { Descendant, Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { LinkDialog } from './dialogs/LinkDialog'
import { TableDialog } from './dialogs/TableDialog'
import { MaterialUISwitch } from './MaterialUISwitch'
import { createToolbarItems, ToolbarEvents } from './toolbar-items'

interface HeaderProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Header = ({ editor, setValue }: HeaderProps) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);

  const toolbarEvents: ToolbarEvents = {
    openLinkDialog: () => setLinkDialogOpen(true),
    openTableDialog: () => setTableDialogOpen(true),
  };

  const toolbarItems = createToolbarItems(editor, toolbarEvents)

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(30, 30, 30, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: 1300,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: '64px',
          display: 'flex',
          gap: 2,
        }}
      >
        {/* Logo and Title */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Edit color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            BEdit
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem />

        {/* 编辑工具栏 */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            flexWrap: 'wrap',
            gap: 0.5,
            flex: 1,
            '& > *': {
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            },
          }}
        >
          {toolbarItems.map((item) =>
            item.type === 'separator' ? (
              <Box
                key={item.key}
                sx={{
                  height: 24,
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                  mx: 0.5,
                }}
              />
            ) : (
              <Tooltip
                key={item.key}
                title={item.commandKey ? `${item.title} (${item.commandKey})` : item.title}
                arrow
              >
                <IconButton
                  size="small"
                  onClick={item.onSelect}
                  disabled={item.disabled}
                  color={item.active ? 'primary' : 'default'}
                  sx={item.sx}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            )
          )}
        </Stack>

        {/* 主题切换 */}
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
  )
}