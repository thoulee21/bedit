import { createTheme } from '@mui/material/styles';
import { roboto } from '@/utils/fonts';

// 定义主题色 - 使用更鲜艳的绿色
const primaryGreen = {
  50: '#E8F5E9',
  100: '#C8E6C9',
  200: '#A5D6A7',
  300: '#81C784',
  400: '#66BB6A',
  500: '#4CAF50',
  600: '#43A047',
  700: '#388E3C',
  800: '#2E7D32',
  900: '#1B5E20',
  A100: '#B9F6CA',
  A200: '#69F0AE',
  A400: '#00E676',
  A700: '#00C853',
  light: '#69F0AE',  // 更亮的绿色
  main: '#00E676',   // 鲜艳的绿色
  dark: '#00C853',   // 深绿色
  contrastText: '#fff',
};

// 定义强调色
const accentColors = {
  purple: '#9C27B0',
  blue: '#2196F3',
  orange: '#FF9800',
  pink: '#E91E63',
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
    secondary: {
      main: accentColors.purple,
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    success: {
      main: primaryGreen.A400,
      light: primaryGreen.A200,
      dark: primaryGreen.A700,
    },
    info: {
      main: accentColors.blue,
    },
    warning: {
      main: accentColors.orange,
    },
    error: {
      main: accentColors.pink,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 230, 118, 0.15)',  // 绿色阴影
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 230, 118, 0.2)',
          },
        },
        outlined: {
          borderColor: primaryGreen.A200,
          '&:hover': {
            borderColor: primaryGreen.A400,
            backgroundColor: 'rgba(0, 230, 118, 0.08)',
          },
        },
        contained: {
          background: `linear-gradient(45deg, ${primaryGreen.main}, ${primaryGreen.light})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${primaryGreen.A400}, ${primaryGreen.A200})`,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            backgroundColor: 'rgba(0, 230, 118, 0.08)',
            transform: 'scale(1.1) rotate(8deg)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            backgroundColor: 'rgba(0, 230, 118, 0.08)',
            transform: 'translateX(4px)',
            color: primaryGreen.main,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
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
    secondary: {
      main: accentColors.purple,
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
    },
  },
  components: {
    ...lightTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1E1E1E',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(0, 230, 118, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
}); 