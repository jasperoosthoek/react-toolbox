import express from 'express';
import { createServer as createViteServer } from 'vite';

// Set Node.js environment variables for SSR
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

async function createServer() {
  const app = express();

  try {
    // Create Vite server in middleware mode for main examples
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: './src/examples',
      configFile: './vite.config.ts',
      // Enhanced SSR configuration - externalize problematic packages
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
          'react-transition-group',
          'react-dnd',
          'react-dnd-html5-backend'
          // Removed react-syntax-highlighter - now handled dynamically
        ]
      },
      resolve: {
        alias: {
          '@': process.cwd() + '/src'
        }
      },
      // Minimal define - let Node.js handle everything else
      define: {
        global: 'globalThis',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        console.log('SSR Request:', url);
        
        // Load the main examples server entry
        const { render } = await vite.ssrLoadModule('/entry.server.tsx');
        
        // Render the main app
        const html = render();
        
        console.log('✅ SSR Success', html.length, 'characters');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        console.error('❌ SSR Render Error:', e.message);
        console.error('Stack:', e.stack);
        
        // Fallback to SPA mode if SSR fails
        console.log('🔄 Falling back to SPA mode...');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(
          `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox Examples (SPA Fallback)</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script type="module" src="/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
    <div style="position: fixed; top: 10px; right: 10px; background: #d9534f; color: white; padding: 8px; border-radius: 4px; font-size: 12px; z-index: 9999;">
      SSR Failed - SPA Fallback
    </div>
  </body>
</html>`
        );
      }
    });

    const port = 3000;
    app.listen(port, () => {
      console.log(`React Toolbox Examples (SSR) running at http://localhost:3000`);
      console.log('Now serving main examples with SSR-safe CodeBlock');
    });
  } catch (error) {
    console.error('❌ Failed to start SSR server:', error);
    console.log('\n🔄 Fallback: Try running npm run dev:spa (SPA mode)');
    process.exit(1);
  }
}

createServer().catch((error) => {
  console.error('❌ Server startup failed:', error);
  console.log('\n🔄 Fallback: Try running npm run dev:spa (SPA mode)');
  process.exit(1);
});
