import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'framer-motion';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '8px', background: '#0A1D30', color: '#FFFFFF', fontSize: '14px', padding: '10px 14px' },
              success: { iconTheme: { primary: '#3E9E66', secondary: '#FFFFFF' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } },
            }}
          />
        </BrowserRouter>
      </MotionConfig>
    </I18nProvider>
  </React.StrictMode>
);
