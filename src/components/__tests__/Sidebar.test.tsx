import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from '@/store/preferencesSlice';

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

// 创建测试用的 store
const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
});

describe('Sidebar', () => {
  const editor = withHistory(withReact(createEditor()));
  const setValue = jest.fn();

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </Provider>
    );
  };

  it('renders correctly', () => {
    renderWithProviders(
      <Sidebar editor={editor} setValue={setValue} />
    );

    // 验证基本元素是否存在
    expect(screen.getByText('书签')).toBeInTheDocument();
    expect(screen.getByText('导入')).toBeInTheDocument();
    expect(screen.getByText('导出')).toBeInTheDocument();
    expect(screen.getByText('设置')).toBeInTheDocument();
    expect(screen.getByText('关于')).toBeInTheDocument();
  });

  it('opens dialogs when clicking buttons', () => {
    renderWithProviders(
      <Sidebar editor={editor} setValue={setValue} />
    );

    // 点击按钮并验证对话框是否打开
    fireEvent.click(screen.getByText('书签'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
}); 