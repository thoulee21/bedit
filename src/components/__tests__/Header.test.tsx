import React from 'react';
import { render } from '@testing-library/react';
import { Header } from '../Header';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from '@/store';

// Mock stylex
jest.mock('@stylexjs/stylex', () => ({
  create: () => ({}),
  props: () => ({}),
}));

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('Header', () => {
  const editor = withHistory(withReact(createEditor()));

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Header
            editor={editor}
            setValue={() => {}}
            onToggleOutline={() => {}}
            onToggleChat={() => {}}
            showOutline={false}
            showChat={false}
            isSmallScreen={false}
            setSidebarOpen={() => {}}
            sidebarOpen={false}
          />
        </ThemeProvider>
      </Provider>
    );
  });
}); 