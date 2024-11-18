'use client'

import React, { StrictMode } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, ThemeProvider, Stack, Paper, IconButton } from '@mui/material';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { globalStyles } from '@/styles/global';
import { getTheme } from '@/theme/theme';
import { DEV_INITIAL_CONTENT } from '@/utils/dev-content';
import { Global } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { Snackbar } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { Chat } from '@/components/Chat';
import { DocumentOutline } from '@/components/DocumentOutline';
import SlateEditor from '@/components/SlateEditor';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/store/hooks';

function HomeContent() {
  const [value, setValue] = React.useState(DEV_INITIAL_CONTENT);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState('');
  const editor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);

  const theme = React.useMemo(
    () => getTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode]
  );

  const snackbarAction = (
    <IconButton
      size="small"
      color="inherit"
      onClick={() => setSnackbarOpen(false)}
    >
      <Close />
    </IconButton>
  );

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles(prefersDarkMode)} />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        pt: '64px',
      }}>
        <Header editor={editor} setValue={setValue} />
        <Box sx={{ 
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.default',
        }}>
          <Sidebar editor={editor} setValue={setValue} />
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ 
              flex: 1,
              px: 1.5,
              py: 0.5,
              overflow: 'hidden',
            }}
          >
            {/* 左侧大纲 */}
            <Paper
              elevation={3}
              sx={{
                width: '280px',
                height: '100%',
                overflow: 'auto',
                overscrollBehavior: 'none',
                borderRadius: 1.5,
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
              }}
            >
              <DocumentOutline editor={editor} />
            </Paper>

            {/* 中间编辑区 */}
            <Box
              sx={{
                flex: 1,
                height: '100%',
                overflow: 'auto',
                overscrollBehavior: 'none',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  width: '210mm',
                  minHeight: '297mm',
                  height: 'fit-content',
                  borderRadius: 1.5,
                  transition: theme => theme.transitions.create(
                    ['box-shadow', 'background-color'],
                    {
                      duration: theme.transitions.duration.standard,
                    }
                  ),
                  '&:hover': {
                    boxShadow: 6,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  my: 2,
                }}
              >
                <SlateEditor 
                  editor={editor}
                  value={value}
                  onChange={setValue}
                />
              </Paper>
            </Box>

            {/* 右侧聊天区 */}
            <Paper
              elevation={3}
              sx={{
                width: '320px',
                height: '100%',
                overflow: 'auto',
                overscrollBehavior: 'none',
                borderRadius: 1.5,
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
              }}
            >
              <Chat />
            </Paper>
          </Stack>
        </Box>
        <StatusBar editor={editor} />
      </Box>

      <Snackbar
        open={snackbarOpen}
        message={snackMsg}
        action={snackbarAction}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          mb: '24px',
        }}
      />
    </ThemeProvider>
  );
}

export default function Home() {
  return (
    <StrictMode>
      <Provider store={store}>
        <HomeContent />
      </Provider>
    </StrictMode>
  );
}
