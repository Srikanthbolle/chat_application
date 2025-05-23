// theme/index.ts
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Type augmentation for Button variants
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    brand: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    mode: 'light',
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
      variants: [
        {
          props: { variant: 'brand' },
          style: {
            backgroundColor: '#3f51b5',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#757de8',
            },
          },
        },
      ],
    },
  },
});

export default theme;