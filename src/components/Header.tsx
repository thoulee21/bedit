import { AppBar, Box, Toolbar, useTheme, Stack } from '@mui/material'
import { OpenFile } from './OpenFile'
import { SaveFile } from './SaveFile'
import { useContext } from 'react'
import { Preferences } from '@/app/PreferenceProvider'
import { Editor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { MaterialUISwitch } from './MaterialUISwitch'

interface HeaderProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
}

export const Header = ({ editor, setValue }: HeaderProps) => {
  const theme = useTheme()
  const preferences = useContext(Preferences)

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar variant="dense">
        <Stack direction="row" spacing={1}>
          <OpenFile editor={editor} setValue={setValue} />
          <SaveFile editor={editor} />
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <MaterialUISwitch 
          checked={preferences.prefersDarkMode}
          onChange={() => preferences.setPrefersDarkMode(!preferences.prefersDarkMode)}
        />
      </Toolbar>
    </AppBar>
  )
}