import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DynamicProvider from './providers/DynamicProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DynamicProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </DynamicProvider>  
    </ErrorBoundary>
  </React.StrictMode>
);
