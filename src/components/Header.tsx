import { AppBar, Box, Toolbar, useTheme, Stack, Divider, Typography } from '@mui/material'
import { useContext } from 'react'
import { Preferences } from '@/app/PreferenceProvider'
import { Editor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { MaterialUISwitch } from './MaterialUISwitch'
import { createToolbarItems } from './toolbar-items'
import { ToolbarTooltip } from './ToolbarTooltip'
import { IconButton } from '@mui/material'
import { Edit } from '@mui/icons-material'

interface HeaderProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Header = ({ editor, setValue }: HeaderProps) => {
  const theme = useTheme()
  const preferences = useContext(Preferences)
  const toolbarItems = createToolbarItems(editor)

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
              <ToolbarTooltip
                key={item.key}
                title={item.title}
                commandKey={item.key}
              >
                <IconButton
                  size="small"
                  onClick={item.onSelect}
                  disabled={item.disabled}
                  color={item.active ? 'primary' : 'default'}
                  sx={{ 
                    p: 0.75,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              </ToolbarTooltip>
            )
          )}
        </Stack>

        {/* 主题切换 */}
        <Box sx={{ ml: 'auto' }}>
          <MaterialUISwitch 
            checked={preferences.prefersDarkMode}
            onChange={() => preferences.setPrefersDarkMode(!preferences.prefersDarkMode)}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}