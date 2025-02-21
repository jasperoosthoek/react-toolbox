// Uncomment this line to use CSS modules
// import styles from './app.module.scss';

import { Route, Routes, Link } from 'react-router';

export function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
            </div>
          }
        />
      </Routes>
  );
}

export default App;
