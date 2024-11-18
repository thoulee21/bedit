import { createTheme, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
        light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
        dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
        contrastText: mode === 'dark' ? '#000' : '#fff',
      },
      secondary: {
        main: mode === 'dark' ? '#ce93d8' : '#9c27b0',
        light: mode === 'dark' ? '#f3e5f5' : '#ba68c8',
        dark: mode === 'dark' ? '#ab47bc' : '#7b1fa2',
        contrastText: mode === 'dark' ? '#000' : '#fff',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#fff',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
      text: {
        primary: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
        secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
  });

  // 添加 CSS 变量
  document.documentElement.style.setProperty('--primary-main', theme.palette.primary.main);
  document.documentElement.style.setProperty('--primary-light', theme.palette.primary.light);
  document.documentElement.style.setProperty('--primary-dark', theme.palette.primary.dark);
  document.documentElement.style.setProperty('--text-primary', theme.palette.text.primary);
  document.documentElement.style.setProperty('--text-secondary', theme.palette.text.secondary);
  document.documentElement.style.setProperty('--background-paper', theme.palette.background.paper);
  document.documentElement.style.setProperty('--divider-color', theme.palette.divider);

  return theme;
}; 