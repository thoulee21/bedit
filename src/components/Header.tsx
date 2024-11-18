import { AppBar, Box, Toolbar, useTheme, Stack, Divider } from '@mui/material'
import { OpenFile } from './OpenFile'
import { SaveFile } from './SaveFile'
import { useContext } from 'react'
import { Preferences } from '@/app/PreferenceProvider'
import { Editor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { MaterialUISwitch } from './MaterialUISwitch'
import { createToolbarItems } from './toolbar-items'
import { ToolbarTooltip } from './ToolbarTooltip'
import { IconButton } from '@mui/material'

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
          ? 'rgba(18, 18, 18, 0.7)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
        zIndex: 1300,
        mb: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(10px)',
          zIndex: -1,
        },
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: '64px',
          display: 'flex',
          gap: 2,
          pb: 0.5,
        }}
      >
        {/* 文件操作区 */}
        <Stack direction="row" spacing={1}>
          <OpenFile editor={editor} setValue={setValue} />
          <SaveFile editor={editor} />
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
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
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
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
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