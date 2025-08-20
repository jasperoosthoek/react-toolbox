export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('SSR Request:', req.url);

    // Import pre-built SSR bundle (much faster than creating Vite server)
    const { render } = await import('../dist-examples/server.cjs');
    
    const html = render(); // No URL needed for single-page app
    const renderTime = Date.now() - startTime;

    console.log(`SSR Success (${renderTime}ms)`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.setHeader('X-Render-Time', renderTime.toString());
    res.status(200).send(html);
    
  } catch (error) {
    const renderTime = Date.now() - startTime;
    console.error(`SSR Error (${renderTime}ms):`, error.message);

    const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox Examples - Loading...</title>
    <meta name="description" content="Comprehensive React component library with Bootstrap styling. Live examples and documentation." />
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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Render-Time', renderTime.toString());
    res.status(200).send(fallbackHtml);
  }
}