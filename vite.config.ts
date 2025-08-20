import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Vite config for examples app
export default defineConfig({
  plugins: [
    react({
      // Completely disable refresh for SSR
      include: /\.(jsx|tsx)$/,
      exclude: /node_modules/,
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
      babel: {
        plugins: [],
        presets: [],
      },
      // Disable all development features that cause preamble issues
      fastRefresh: false,
    })
  ],
  root: './src/examples',
  build: {
    outDir: '../../dist-examples',
    emptyOutDir: true,
    cssCodeSplit: false, // Bundle all CSS into one file for better loading
    sourcemap: false, // Disable sourcemaps in production
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './src/examples/index.html')
      },
      output: {
        // Fixed filenames for CSS and JS - no hashing for consistent URLs
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/style.css';  // Fixed CSS name
          }
          return 'assets/[name].[ext]';
        },
        chunkFileNames: 'assets/[name].js',       // JS chunks without hash
        entryFileNames: 'assets/main.js'          // Main JS entry without hash
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: false, // Disable HMR to avoid preamble issues
  },
  // SSR configuration with proper CJS/ESM handling
  ssr: {
    noExternal: [
      // Only bundle our own code and safe libraries
      /^@jasperoosthoek/,
      'classnames',
      'invariant'
    ],
    external: [
      // Externalize all React ecosystem packages
      'react',
      'react-dom', 
      'react-dom/server',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
      'prop-types',
      'react-bootstrap',
      'react-transition-group'
      // Removed react-syntax-highlighter - now handled dynamically
    ]
  },
  // Define missing Node.js globals for SSR
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
