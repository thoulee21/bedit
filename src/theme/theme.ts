import { createTheme, alpha } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',  // 暗色模式使用更亮的蓝色
      light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
      dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
      contrastText: mode === 'dark' ? '#000' : '#fff',  // 暗色模式使用黑色文字
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
    action: {
      active: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.54)',
      hover: mode === 'dark' ? alpha('#fff', 0.08) : alpha('#000', 0.04),
      selected: mode === 'dark' ? alpha('#fff', 0.16) : alpha('#000', 0.08),
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
      disabledBackground: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: mode === 'dark' ? '#90caf9' : '#1976d2',
          color: mode === 'dark' ? '#000' : '#fff',
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#42a5f5' : '#1565c0',
          },
        },
        outlined: {
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.23)',
          '&:hover': {
            borderColor: mode === 'dark' ? '#90caf9' : '#1976d2',
          },
        },
      },
    },
  },
}); 