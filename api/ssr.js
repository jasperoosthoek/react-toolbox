import { createServer as createViteServer } from 'vite';
import path from 'path';

let vite;

async function getViteServer() {
  if (!vite) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: path.resolve('./src/examples'),
      logLevel: 'error',
      ssr: {
        noExternal: [
          /^@jasperoosthoek/,
          'classnames',
          'invariant'
        ],
        external: [
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
          '@': path.resolve('./src')
        }
      },
      define: {
        global: 'globalThis',
        'process.env.NODE_ENV': '"production"'
      }
    });
  }
  return vite;
}

export default async function handler(req, res) {
  try {
    console.log('SSR Request:', req.url);
    
    const viteServer = await getViteServer();
    
    // Load and render the React app
    const { render } = await viteServer.ssrLoadModule('/entry.server.tsx');
    const html = render();
    
    console.log('SSR Success');
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('SSR Error:', error.message);
    
    // Fallback with error info for debugging
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox Examples - SSR Error</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  </head>
  <body>
    <div class="container mt-5">
      <div class="alert alert-warning">
        <h4>⚠️ SSR Fallback Mode</h4>
        <p>Server-side rendering encountered an issue. The app will load client-side instead.</p>
        <details class="mt-3">
          <summary>Technical Details</summary>
          <pre class="mt-2 small">${error.message}</pre>
        </details>
      </div>
      <div id="root"></div>
    </div>
    
    <script type="module">
      // Attempt client-side rendering as fallback
      console.log('Loading React Toolbox Examples in client-side mode...');
      
      // This would normally be the hydration script
      import('https://esm.sh/react@19').then(({ createElement }) => {
        import('https://esm.sh/react-dom@19/client').then(({ createRoot }) => {
          const root = document.getElementById('root');
          if (root && !root.hasChildNodes()) {
            // Client-side rendering fallback
            root.innerHTML = \`
              <div class="text-center mt-5">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading React Toolbox Examples...</p>
              </div>
            \`;
          }
        });
      });
    </script>
  </body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fallbackHtml);
  }
}
