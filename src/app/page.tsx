'use client'

import React, { StrictMode, useState } from 'react';
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
import { useMediaQuery } from '@mui/material';

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

  const [showOutline, setShowOutline] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  React.useEffect(() => {
    if (isSmallScreen) {
      setShowOutline(false);
      setShowChat(false);
    } else {
      setShowOutline(true);
      setShowChat(true);
    }
  }, [isSmallScreen]);

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles(prefersDarkMode)} />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        pt: { xs: '56px', sm: '64px' },
      }}>
        <Header 
          editor={editor} 
          setValue={setValue}
          onToggleOutline={() => setShowOutline(!showOutline)}
          onToggleChat={() => setShowChat(!showChat)}
          showOutline={showOutline}
          showChat={showChat}
          isSmallScreen={isSmallScreen}
        />
        <Box sx={{ 
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.default',
          mt: { xs: 0, sm: 0 },
        }}>
          <Sidebar editor={editor} setValue={setValue} />
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ 
              flex: 1,
              px: { xs: 0.5, sm: 1, md: 1.5 },
              py: 0.5,
              overflow: 'hidden',
            }}
          >
            {/* 左侧大纲 */}
            {showOutline && (
              <Paper
                elevation={3}
                sx={{
                  width: { xs: '100%', md: '280px' },
                  height: '100%',
                  overflow: 'auto',
                  overscrollBehavior: 'none',
                  borderRadius: 1.5,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                  display: isSmallScreen && !showOutline ? 'none' : 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  position: { xs: 'absolute', md: 'relative' },
                  zIndex: { xs: 2, md: 1 },
                  left: 0,
                  right: 0,
                }}
              >
                <DocumentOutline editor={editor} />
              </Paper>
            )}

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
                ml: { xs: 0, md: showOutline ? 1.5 : 0 },
                mr: { xs: 0, md: showChat ? 1.5 : 0 },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  width: { xs: '100%', sm: '100%', md: '210mm' },
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
                  mx: { xs: 0.5, sm: 1, md: 'auto' },
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
            {showChat && (
              <Paper
                elevation={3}
                sx={{
                  width: { xs: '100%', md: '320px' },
                  height: '100%',
                  overflow: 'auto',
                  overscrollBehavior: 'none',
                  borderRadius: 1.5,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                  display: isSmallScreen && !showChat ? 'none' : 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'background.paper',
                  position: { xs: 'absolute', md: 'relative' },
                  zIndex: { xs: 2, md: 1 },
                  left: 0,
                  right: 0,
                }}
              >
                <Chat />
              </Paper>
            )}
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
