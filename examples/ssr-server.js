import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set Node.js environment variables for SSR
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

async function createServer() {
  const app = express();

  try {
    // Create Vite server in middleware mode for main examples
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: __dirname,
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
        ]
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src')
        }
      },
      // Minimal define - let Node.js handle everything else
      define: {
        global: 'globalThis',
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    });

    app.use(vite.middlewares);

    // Handle favicon redirect
    app.get('/favicon.ico', (req, res) => {
      res.redirect(301, '/favicon.png');
    });

    // SSR handler
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      // Skip SSR for static assets
      if (
        url.includes('.') && !url.endsWith('.html') ||
        url.includes('/.well-known/') ||
        url.includes('/favicon')
      ) {
        return next();
      }

      try {
        // Load the main examples server entry
        const { render } = await vite.ssrLoadModule('/entry.server.tsx');

        // Render the main app
        const html = render();

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(e);
        }
        console.error('SSR Error:', e.message);

        // Fallback to SPA mode
        res.status(200).set({ 'Content-Type': 'text/html' }).end(
          `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox Examples</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script type="module" src="/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
        );
      }
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`React Toolbox Examples (SSR) running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start SSR server:', error);
    process.exit(1);
  }
}

createServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
