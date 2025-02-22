
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import './app.module.scss';

import { BrowserRouter, Route, Routes } from 'react-router';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { LocalizationProvider } from '@jasperoosthoek/react-toolbox';

import DashboardPage from './pages/DashboardPage';
import NoMatchPage from './pages/NoMatchPage';

export function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <LocalizationProvider lang='en'>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<DashboardPage />}
            />
            
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
