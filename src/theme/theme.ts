import { createTheme } from '@mui/material/styles';
import { roboto } from '@/utils/fonts';

// 定义主题色
const primaryGreen = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',  // main
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853',
  light: '#4caf50',
  main: '#2e7d32',
  dark: '#1b5e20',
  contrastText: '#fff',
};

// 创建亮色主题
export const lightTheme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1a1a1a',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#2a2a2a',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.75,
      color: '#4a4a4a',
    },
  },
  palette: {
    mode: 'light',
    primary: primaryGreen,
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '6px 16px',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: primaryGreen[300],
          '&:hover': {
            borderColor: primaryGreen[500],
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
            transform: 'translateX(4px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '56px !important',
        },
      },
    },
  },
});

// 创建暗色主题
export const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: primaryGreen,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    ...lightTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          backgroundColor: '#1e1e1e',
          '&:hover': {
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
}); 