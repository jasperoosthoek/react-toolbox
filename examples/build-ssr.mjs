#!/usr/bin/env node
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function buildSSR() {
  console.log('Building React Toolbox Examples SSR bundle...');

  try {
    // Build client assets first with Vite (examples)
    console.log('Building client assets...');
    const { execSync } = await import('child_process');
    execSync('vite build --config examples/vite.config.ts', { stdio: 'inherit', cwd: projectRoot });

    // Build server bundle with esbuild
    console.log('Building server bundle...');
    await build({
      entryPoints: [join(projectRoot, 'examples/entry.server.tsx')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outfile: join(projectRoot, 'dist-examples/server.cjs'),
      external: [
        // Only externalize Node.js built-ins
        'fs',
        'path',
        'url',
        'crypto',
        'stream',
        'util',
        'events',
        'os',
        'http',
        'https'
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.PROD': 'true',
        'import.meta.env.DEV': 'false'
      },
      jsx: 'automatic',
      jsxImportSource: 'react',
      minify: true,
      sourcemap: false,
      metafile: true,
      loader: {
        '.css': 'text',
        '.scss': 'text',
        '.svg': 'text',
        '.png': 'file',
        '.jpg': 'file',
        '.jpeg': 'file',
        '.gif': 'file',
        '.webp': 'file'
      },
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': join(projectRoot, 'src')
      }
    });

    // Build production server
    console.log('Building production server...');
    await build({
      entryPoints: [join(projectRoot, 'examples/production-server.ts')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outfile: join(projectRoot, 'dist-examples/production-server.cjs'),
      external: [
        // Externalize Node.js built-ins
        'fs',
        'path',
        'url',
        'crypto',
        'stream',
        'util',
        'events',
        'os',
        'http',
        'https',
        // Externalize the SSR bundle - will be imported at runtime
        './dist-examples/server.cjs'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      minify: false, // Keep readable for debugging
      sourcemap: false
    });

    // Copy static files to dist-examples
    console.log('Copying static files...');
    const staticFiles = [
      { src: 'examples/favicon.png', dest: 'dist-examples/favicon.png' }
    ];

    for (const file of staticFiles) {
      const srcPath = join(projectRoot, file.src);
      const destPath = join(projectRoot, file.dest);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied ${file.src} → ${file.dest}`);
      } else {
        console.warn(`  ⚠ Source file not found: ${file.src}`);
      }
    }

    // Move production-server.cjs to root (outside web-accessible dist-examples/)
    console.log('Moving production server to root...');
    const prodServerSrc = join(projectRoot, 'dist-examples/production-server.cjs');
    const prodServerDest = join(projectRoot, 'production-server.cjs');

    if (fs.existsSync(prodServerSrc)) {
      fs.renameSync(prodServerSrc, prodServerDest);
      console.log('  ✓ Moved dist-examples/production-server.cjs → production-server.cjs');
    } else {
      console.warn('  ⚠ dist-examples/production-server.cjs not found');
    }

    console.log('✅ React Toolbox Examples SSR build complete!');
    console.log('Generated files:');
    console.log('  - dist-examples/server.cjs (SSR server bundle)');
    console.log('  - production-server.cjs (Express production server - in root)');
    console.log('  - dist-examples/favicon.png (Static asset)');
    console.log('  - dist-examples/assets/ (Client assets)');

    } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
    }
}

buildSSR();
