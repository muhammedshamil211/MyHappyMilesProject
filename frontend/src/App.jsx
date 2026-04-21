import Homepage from './pages/Homepage'
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
import AdminBookings from './component/admin/pages/AdminBookings/AdminBookings';
import AdminUsers from './component/admin/pages/AdminUsers/AdminUsers';
import AdminReviews from './component/admin/pages/AdminReviews/AdminReviews';
import AdminPackageAnalytics from './component/admin/pages/AdminAnalytics/AdminPackageAnalytics';
import PackageDetailedAnalytics from './component/admin/pages/AdminAnalytics/PackageDetailedAnalytics';
import PackageDetailsPage from './pages/PackageDetailsPage';
import PackagesPage from './pages/PackagesPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ScrollToHash from './component/user/components/ScrollToHash';
import UserPublicRoute from './component/user/UserPrivateRoute/UserPublicRoute';
import UserPrivateRoute from './component/user/UserPrivateRoute/UserPrivateRoute';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { LoginContext } from './context/LoginContext';
import LoadingSplash from './component/shared/Loading/LoadingSplash';

function App() {
  const { initializing } = useContext(LoginContext);

  if (initializing) {
    return <LoadingSplash />;
  }

  return (
    <PlaceProvider>
      <AdminPlaceProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            {/* User routes */}
            <Route path='/' element={<UserPublicRoute><Homepage /></UserPublicRoute>} />
            <Route path="/place/:name" element={<UserPublicRoute><PlacePage /></UserPublicRoute>} />
            <Route path="/package/:id" element={<UserPublicRoute><PackageDetailsPage /></UserPublicRoute>} />
            <Route path="/packages" element={<UserPublicRoute><PackagesPage /></UserPublicRoute>} />

            <Route path="/my-orders" element={<UserPrivateRoute><MyOrdersPage /></UserPrivateRoute>} />

            {/* Admin routes */}
            <Route path='/admin' element={<AdminPrivateRouter><AdminLayout /></AdminPrivateRouter>}>
              <Route path='places' element={<AdminPlace />} />
              <Route path='places/:name' element={<AdminPlacePackages />} />
              <Route path='package/:id/details' element={<AdminPackageDetails />} />
              <Route path='bookings' element={<AdminBookings />} />
              <Route path='users' element={<AdminUsers />} />
              <Route path='reviews' element={<AdminReviews />} />
              <Route path='package-analytics' element={<AdminPackageAnalytics />} />
              <Route path='package-analytics/:id' element={<PackageDetailedAnalytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminPlaceProvider>
    </PlaceProvider>
  )
}

export default App
