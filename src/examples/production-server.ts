import express from 'express';
import path from 'path';

// Import the SSR render function
const { render } = require('./dist-examples/server.cjs');

const app = express();

// Serve static files from root and dist-examples
app.use(express.static('.'));
app.use('/assets', express.static('./dist-examples/assets'));

// Favicon handler
app.get('/favicon.png', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(path.resolve('./dist-examples/favicon.png'));
});

// Handle favicon.ico redirect for compatibility
app.get('/favicon.ico', (req, res) => {
  res.redirect(301, '/favicon.png');
});

// SSR handler for all routes (single page app)
app.get('*', async (req, res) => {
  try {
    const html = render(); // No URL needed for single-page app
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback to client-side rendering
    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox Examples - Loading...</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="stylesheet" href="/assets/style.css">
  </head>
  <body>
    <div class="container mt-5">
      <div class="alert alert-warning">
        <h4>Loading React Toolbox Examples...</h4>
        <p>The component examples are loading. Please wait a moment.</p>
      </div>
      <div id="root"></div>
    </div>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(fallbackHtml);
  }
});

// Start server
const port = process.env.PORT || 3000;

app.listen(port, (error?: Error) => {
  if (error) {
    if ((error as any).code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Try a different port:`);
      console.error(`   PORT=3002 npm run preview:ssr`);
      console.error(`   Or stop other servers first.`);
      process.exit(1);
    } else {
      console.error('❌ Server failed to start:', error.message);
      process.exit(1);
    }
    return;
  }
  
  console.log(`React Toolbox Examples production server running at http://localhost:${port}`);
  console.log('');
  console.log('Available examples:');
  console.log(`  http://localhost:${port}/         - All component examples`);
  console.log(`  http://localhost:${port}/#datatables - DataTable examples`);
  console.log(`  http://localhost:${port}/#forms      - Form examples`);
  console.log(`  http://localhost:${port}/#iconbuttons - IconButton examples`);
});
