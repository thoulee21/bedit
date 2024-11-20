'use client'

import './globals.css'; 

import React, { StrictMode } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Box, ThemeProvider, Stack, Paper, IconButton, useMediaQuery, CssBaseline, Drawer } from '@mui/material';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { getTheme } from '@/theme/theme';
import { DEV_INITIAL_CONTENT } from '@/utils/dev-content';
import { Close, Menu } from '@mui/icons-material';
import { Snackbar } from '@mui/material';
import { Sidebar } from '@/components/Sidebar';
import { Chat } from '@/components/Chat';
import { DocumentOutline } from '@/components/DocumentOutline';
import { SlateEditor } from '@/components/SlateEditor';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import dynamic from 'next/dynamic';
import * as stylex from '@stylexjs/stylex';
import { toggleList } from '@/utils/editor-utils';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'var(--background-default)',
  },
  contentStack: {
    flex: 1,
    overflow: 'hidden',
  },
  sidePanel: {
    overflow: 'auto',
    overscrollBehavior: 'none',
    borderRadius: '12px',
    transition: 'box-shadow 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--background-paper)',
  },
  editorContainer: {
    flex: 1,
    height: '100%',
    overflow: 'auto',
    overscrollBehavior: 'none',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  editorPaper: {
    minHeight: '297mm',
    height: 'fit-content',
    borderRadius: '12px',
    backgroundColor: 'var(--background-paper)',
    display: 'flex',
    flexDirection: 'column',
  },
});

const HomeContent = dynamic(() => Promise.resolve(function HomeContent() {
  const [value, setValue] = React.useState(DEV_INITIAL_CONTENT);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState('');
  const editor = React.useMemo(() => {
    const e = withHistory(withReact(createEditor()));
    
    // 添加 toggleList 方法
    e.toggleList = (format) => toggleList(e, format);
    
    return e;
  }, []);
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);
  const theme = React.useMemo(
    () => getTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode]
  );
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showOutline, setShowOutline] = React.useState(true);
  const [showChat, setShowChat] = React.useState(!isSmallScreen);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
      <CssBaseline />
      <Box {...stylex.props(styles.root)} sx={{ pt: { xs: '56px', sm: '64px' } }}>
        <Header 
          editor={editor} 
          setValue={setValue}
          onToggleOutline={() => setShowOutline(!showOutline)}
          onToggleChat={() => setShowChat(!showChat)}
          showOutline={showOutline}
          showChat={showChat}
          isSmallScreen={isSmallScreen}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
        />
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: 240,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <Sidebar editor={editor} setValue={setValue} />
        </Drawer>
        <Box {...stylex.props(styles.mainContent)}>
          <Stack
            direction="row"
            spacing={1.5}
            {...stylex.props(styles.contentStack)}
            sx={{ 
              px: { xs: 0.5, sm: 1, md: 1.5 },
              py: 0.5,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box {...stylex.props(styles.sidePanel)} sx={{ width: '280px', flexShrink: 0 }}>
              <DocumentOutline editor={editor} />
            </Box>

            <Box {...stylex.props(styles.editorContainer)}>
              <Paper
                elevation={3}
                {...stylex.props(styles.editorPaper)}
                sx={{
                  width: { xs: '100%', sm: '100%', md: '210mm' },
                  my: 2,
                  mx: { xs: 0.5, sm: 1, md: 'auto' },
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
            </Box>

            {showChat && (
              <Box {...stylex.props(styles.sidePanel)} sx={{ width: '280px', flexShrink: 0 }}>
                <Chat />
              </Box>
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
        sx={{ mb: '24px' }}
      />
    </ThemeProvider>
  );
}), {
  ssr: false // 禁用服务器端渲染
});

export default function Home() {
  return (
    <StrictMode>
      <Provider store={store}>
        <HomeContent />
      </Provider>
    </StrictMode>
  );
}
