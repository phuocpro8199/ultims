import { lazy, Suspense } from 'react';
import {
  Route,
  Routes,
  Outlet,
  Navigate,
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';
import { useAppContext } from '@context/appContext';

import routerPath from './constants/routerPath';
import AdminLayout from './layouts/AdminLayout';

const Login = lazy(() => import('./pages/Login/Login'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Product = lazy(() => import('./pages/Product/Product'));

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={routerPath.LOGIN} state={{ from: location }} replace />
  );
};

const RejectedRoute = () => {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  return !isAuthenticated ? <Outlet /> : <Navigate to={from} />;
};
const InitRouter = () => {
  return (
    <Routes>
      {/* admin page */}
      <Route path='' element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path={routerPath.PRODUCT}
            element={
              <Suspense>
                <Product />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route path='' element={<RejectedRoute />}>
        <Route
          path={routerPath.LOGIN}
          element={
            <Suspense>
              <Login />
            </Suspense>
          }
        />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export const router = createBrowserRouter([{ path: '*', Component: InitRouter }]);
