
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { Route, Routes } from 'react-router';

import DashboardPage from './pages/DashboardPage';
import NoMatchPage from './pages/NoMatchPage';


export function App() {
  return (
      <Routes>
        <Route
          path="/"
          element={<DashboardPage />}
        />
        
        <Route path="*"
          element={<NoMatchPage />}
        />
      </Routes>
  );
}

export default App;
