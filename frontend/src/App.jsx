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
import AdminPackageDetails from './component/admin/pages/PackageDetails/AdminPackageDetails';
import PackageDetailsPage from './pages/PackageDetailsPage';
import PackagesPage from './pages/PackagesPage';
import ScrollToHash from './component/user/components/ScrollToHash';

function App() {

  return (
    <PlaceProvider>
      <AdminPlaceProvider>
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            {/* User routes */}
            <Route path='/' element={<Homepage />} />
            <Route path="/place/:name" element={<PlacePage />} />
            <Route path="/package/:id" element={<PackageDetailsPage />} />
            <Route path="/packages" element={<PackagesPage />} />

            {/* Admin routes */}
            <Route path='/admin' element={<AdminPrivateRouter><AdminLayout /></AdminPrivateRouter>}>
              <Route path='places' element={<AdminPlace />} />
              <Route path='places/:name' element={<AdminPlacePackages />} />
              <Route path='package/:id/details' element={<AdminPackageDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminPlaceProvider>
    </PlaceProvider>
  )
}

export default App
