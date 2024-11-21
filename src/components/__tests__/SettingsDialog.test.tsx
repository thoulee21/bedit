import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsDialog } from '../dialogs/SettingsDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer from '@/store/preferencesSlice';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
  },
});

describe('SettingsDialog', () => {
  const onClose = jest.fn();

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {ui}
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    renderWithProviders(
      <SettingsDialog open={true} onClose={onClose} />
    );

    expect(screen.getByText('设置')).toBeInTheDocument();
    expect(screen.getByText('暗色模式')).toBeInTheDocument();
  });

  it('handles theme toggle', () => {
    renderWithProviders(
      <SettingsDialog open={true} onClose={onClose} />
    );

    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    
    // 验证 Redux store 中的状态是否更新
    expect(store.getState().preferences.prefersDarkMode).toBe(true);
  });

  it('calls onClose when close button is clicked', () => {
    renderWithProviders(
      <SettingsDialog open={true} onClose={onClose} />
    );

    fireEvent.click(screen.getByText('关闭'));
    expect(onClose).toHaveBeenCalled();
  });
}); 