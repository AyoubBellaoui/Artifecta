import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px', background: '#001A33', color: '#F2F0E6' },
          success: { iconTheme: { primary: '#065F2E', secondary: '#F2F0E6' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#F2F0E6' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
