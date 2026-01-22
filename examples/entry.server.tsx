import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

// Pre-compile HTML template for better performance
const HTML_TEMPLATE = {
  start: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Toolbox - Bootstrap React Components Examples</title>
    <meta name="description" content="Comprehensive React component library with Bootstrap styling. DataTables, Forms, Icon Buttons, and more. Live examples and documentation." />
    <meta name="keywords" content="react, components, bootstrap, datatable, forms, UI library, typescript, react-bootstrap" />
    <meta name="author" content="Jasper Oosthoek" />
    
    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png">
    <meta name="theme-color" content="#0d6efd">
    
    <link rel="stylesheet" href="/assets/style.css">
    
    <meta property="og:type" content="website" />
    <meta property="og:title" content="React Toolbox - Bootstrap React Components" />
    <meta property="og:description" content="Comprehensive React component library with Bootstrap styling. Live examples and documentation for DataTables, Forms, Icon Buttons and more." />
    <meta property="og:image" content="/favicon.png" />
    <meta property="og:url" content="https://react-toolbox.vercel.app" />
    <meta property="og:locale" content="en_US" />
    
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="React Toolbox - React Components" />
    <meta name="twitter:description" content="Comprehensive React component library with Bootstrap styling and live examples" />
    <meta name="twitter:image" content="/favicon.png" />
    
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "React Toolbox",
      "description": "Comprehensive React component library that works together with react-bootstrap",
      "url": "https://react-toolbox.vercel.app",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web Browser",
      "programmingLanguage": "TypeScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "author": {
        "@type": "Person",
        "name": "Jasper Oosthoek"
      },
      "codeRepository": "https://github.com/jasperoosthoek/react-toolbox",
      "downloadUrl": "https://www.npmjs.com/package/@jasperoosthoek/react-toolbox",
      "version": "0.10.0"
    }
    </script>
    
    <link rel="modulepreload" href="/assets/main.js">
  </head>
  <body>
    <div id="root">`,
  end: `</div>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>`
};

// Cache rendered components (optional optimization)
const renderCache = new Map<string, string>();
const CACHE_MAX_SIZE = 50; // Smaller cache since no routing
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  html: string;
  timestamp: number;
}

export function render(): string {
  const cacheKey = 'main'; // Single page app, simple cache key
  const now = Date.now();
  
  // Check cache first (optional optimization)
  if (renderCache.has(cacheKey)) {
    const entry = renderCache.get(cacheKey) as CacheEntry;
    if (now - entry.timestamp < CACHE_TTL) {
      return HTML_TEMPLATE.start + entry.html + HTML_TEMPLATE.end;
    }
    renderCache.delete(cacheKey);
  }
  
  try {
    // Render React app (no routing needed for examples app)
    const appHtml = renderToString(<App />);
    
    // Cache the result (manage cache size)
    if (renderCache.size >= CACHE_MAX_SIZE) {
      const firstKey = renderCache.keys().next().value;
      renderCache.delete(firstKey);
    }
    
    renderCache.set(cacheKey, {
      html: appHtml,
      timestamp: now
    });
    
    return HTML_TEMPLATE.start + appHtml + HTML_TEMPLATE.end;
    
  } catch (error) {
    console.error('React render error:', error);
    
    // Return minimal fallback
    return HTML_TEMPLATE.start + 
           '<div class="container mt-5"><div class="alert alert-warning"><h4>Loading React Toolbox Examples...</h4><p>Please wait while the component examples load.</p></div></div>' + 
           HTML_TEMPLATE.end;
  }
}

// Export for compatibility
export default render;