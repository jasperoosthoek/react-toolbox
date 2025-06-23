import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.scss';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
(async () => {
  if (typeof window !== 'undefined') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
})();