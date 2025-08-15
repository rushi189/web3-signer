import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6D28D9' },
    secondary: { main: '#06B6D4' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    button: { textTransform: 'none' },
  },
});
