import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read package.json to get library name
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: pkg.name,
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dnd',
        'react-bootstrap',
        'bootstrap',
        'date-fns',
        'date-fns-tz',
        'react-icons',
        'react-localization',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dnd': 'ReactDnd',
          'react-bootstrap': 'ReactBootstrap',
          bootstrap: 'Bootstrap',
          'date-fns': 'DateFns',
          'date-fns-tz': 'DateFnsTz',
          'react-icons': 'ReactIcons',
          'react-localization': 'ReactLocalization',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
