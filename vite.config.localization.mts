import { defineConfig } from 'vite';
import { resolve, isAbsolute } from 'path';

// Server-safe subpath `@jasperoosthoek/react-toolbox/localization`: ESM only, no React, `localized-strings` bundled.
// A separate build because Vite's library mode doesn't allow several entries when one of the formats is UMD.
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/localization/standalone.ts'),
      formats: ['es'],
      fileName: () => 'localization.mjs',
    },
    rollupOptions: {
      // Bundle only localized-strings. Any other package import (react, react-localization, ...) stays an import, so
      // scripts/test-package.mjs catches it instead of a copy of React ending up inside this file
      external: (id) => !id.startsWith('.') && !isAbsolute(id) && !id.startsWith('\0') && id !== 'localized-strings',
    },
    outDir: 'dist',
    // Runs after the main build: keep its output
    emptyOutDir: false,
    sourcemap: true,
  },
});
