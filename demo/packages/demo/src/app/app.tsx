
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { BrowserRouter, Route, Routes } from 'react-router';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { LocalizationProvider } from '@jasperoosthoek/react-toolbox';
import localization from './localization/localization';
import Dashboard from './components/Dashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import DataTablePage from './pages/datatable/DataTablePage';
import NoMatchPage from './pages/NoMatchPage';

export function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider localization={localization}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            >
              <Route
                index
                element={<DashboardPage />}
              />
              <Route
                path="datatable"
                element={<DataTablePage />}
              />
            </Route>            
            <Route path="*"
              element={<NoMatchPage />}
            />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </DndProvider>
  );
}

export default App;
