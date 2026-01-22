import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root')!;

// Check if we're hydrating SSR content or doing client-side rendering
if (root.hasChildNodes()) {
  // SSR: Hydrate the server-rendered content
  hydrateRoot(root, 
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // SPA: Client-side render  
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
