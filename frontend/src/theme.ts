import { createTheme } from '@mui/material/styles';

const purple = '#4b008f';
const purpleDeep = '#2a085f';
const purpleBtnA = '#7934ff';
const purpleBtnB = '#6a28ff';
const cyan = '#00d0d1';

export const brand = {
  headerGradient: `linear-gradient(90deg, ${purpleDeep} 0%, ${purple} 50%, ${purpleDeep} 100%)`,
  accent: cyan,
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: purpleBtnA },
    secondary: { main: cyan },
    background: {
      default: purpleDeep,
      paper: 'rgba(255,255,255,0.08)',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255,255,255,.75)',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'",
    h4: { fontWeight: 800, letterSpacing: 0.2 },
    h5: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: brand.headerGradient,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255,255,255,0.18)',
          backdropFilter: 'blur(12px)',
          backgroundImage:
            'linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))',
          boxShadow: '0 20px 40px rgba(0,0,0,.25)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,.06)',
          '& fieldset': { borderColor: 'rgba(255,255,255,.18)' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,.35)' },
        },
        input: { color: '#fff' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 14, paddingTop: 12, paddingBottom: 12 },
        containedPrimary: {
          color: '#fff',
          backgroundImage: `linear-gradient(90deg, ${purpleBtnA} 0%, ${purpleBtnB} 50%, ${purpleBtnA} 100%)`,
          boxShadow: '0 10px 24px rgba(108,40,255,.45)',
          '&:hover': {
            filter: 'brightness(1.05)',
            boxShadow: '0 12px 28px rgba(108,40,255,.55)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
