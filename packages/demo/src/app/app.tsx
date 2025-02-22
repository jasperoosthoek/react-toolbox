
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { Route, Routes } from 'react-router';
import DashboardPage from './pages/DashboardPage';

export function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={<DashboardPage />}
        />
      </Routes>
  );
}

export default App;
