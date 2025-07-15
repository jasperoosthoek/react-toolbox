import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config for examples app
export default defineConfig({
  plugins: [react()],
  root: './src/examples',
  build: {
    outDir: '../../dist-examples',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
