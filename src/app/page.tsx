'use client'

import { Chat } from '@/components/Chat';
import { DocumentOutline } from '@/components/DocumentOutline';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import SlateEditor from '@/components/SlateEditor';
import { darkTheme, lightTheme } from '@/theme/theme';
import { Close } from '@mui/icons-material';
import { Box, Button, CircularProgress, Paper, Snackbar, Stack, ThemeProvider } from '@mui/material';
import { StrictMode, useMemo, useState } from "react";
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import { Preferences } from './PreferenceProvider';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
] as const;

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
          <Header editor={editor} setValue={setValue} />
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Stack
              direction="row"
              spacing={3}
              sx={{ 
                px: 4,
                py: 2,
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                backgroundColor: 'background.default',
                flex: 1,
              }}
            >
              {/* 左侧目录 */}
              <Paper
                elevation={3}
                sx={{
                  width: '250px',
                  height: '100%',
                  overflow: 'auto',
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <DocumentOutline editor={editor} />
              </Paper>

              {/* 中间编辑区 */}
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <SlateEditor 
                  editor={editor}
                  value={value}
                  onChange={setValue}
                />
              </Paper>

              {/* 右侧聊天区 */}
              <Paper
                elevation={3}
                sx={{
                  width: '300px',
                  height: '100%',
                  overflow: 'auto',
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <Chat />
              </Paper>
            </Stack>
          </Box>

          <Snackbar
            open={snackbarOpen}
            message={snackMsg}
            action={snackbarAction}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          />
        </ThemeProvider>
      </Preferences.Provider>
    </StrictMode>
  );
}
