import Homepage from './pages/homepage'
import { PlacePage } from './pages/PlacePage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlaceProvider } from './component/user/context/PlaceContext';
import AdminPage from './pages/AdminPage';
import AdminPrivateRouter from './component/admin/AdminPrivateRouter/AdminPrivateRouter';
import AdminLayout from './component/admin/layout/AdminLayout/AdminLayout';
import { AdminPlaceProvider } from './component/admin/context/AdminPlaceContext';
import AdminPlace from './component/admin/pages/AdminPlace/AdminPlace';
import AdminPlacePackages from './component/admin/pages/PlacePackages/AdminPlacePackages';

function App() {

  return (
    <PlaceProvider>
      <AdminPlaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path="/place/:name" element={<PlacePage />} />

            <Route path='/admin' element={<AdminPrivateRouter><AdminLayout /></AdminPrivateRouter>}>
              <Route path='places' element={<AdminPlace />} />

              <Route path='places/:name' element={<AdminPlacePackages />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminPlaceProvider>
    </PlaceProvider>
  )
}

export default App
