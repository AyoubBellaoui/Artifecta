import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The site talks to Supabase directly, so there is no local API to proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
});
