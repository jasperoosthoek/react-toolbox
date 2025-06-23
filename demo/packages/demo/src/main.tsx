import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './styles.scss';
import { worker } from './mocks/browser';
import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
(async () => {
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
})();