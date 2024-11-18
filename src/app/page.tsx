'use client'

import { Chat } from '@/components/Chat';
import { DocumentOutline } from '@/components/DocumentOutline';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import SlateEditor from '@/components/SlateEditor';
import { StatusBar } from '@/components/StatusBar';
import { globalStyles } from '@/styles/global';
import { darkTheme, lightTheme } from '@/theme/theme';
import { DEV_INITIAL_CONTENT } from '@/utils/dev-content';
import { Global } from '@emotion/react';
import { Close } from '@mui/icons-material';
import { Box, Button, CircularProgress, Paper, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { StrictMode, useMemo, useState } from "react";
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Preferences } from './PreferenceProvider';

const initialValue: Descendant[] = process.env.NODE_ENV === 'development' 
  ? DEV_INITIAL_CONTENT 
  : [{ type: 'paragraph', children: [{ text: '' }] }];

export default function Home() {
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<Descendant[]>(() => initialValue);

  const appTheme = prefersDarkMode ? darkTheme : lightTheme;

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const preferences = useMemo(() => ({
    prefersDarkMode,
    setPrefersDarkMode
  }), [prefersDarkMode]);

  const snackbarAction = useMemo(() => (
    loading ? (
      <CircularProgress color="inherit" size={15} />
    ) : (
      <>
        <Button
          onClick={() => setSnackbarOpen(false)}
        >
          <Close fontSize="small" />
        </Button>
      </>
    )
  ), [loading]);

  return (
    <StrictMode>
      <Preferences.Provider value={preferences}>
        <ThemeProvider theme={appTheme}>
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
              backgroundColor: theme => 
                theme.palette.mode === 'dark' 
                  ? theme.palette.background.default
                  : 'grey.100',
            }}>
              <Sidebar />
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
                    backgroundColor: theme => 
                      theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : 'background.paper',
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
                    backgroundColor: theme => 
                      theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : 'background.paper',
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
      </Preferences.Provider>
    </StrictMode>
  );
}
