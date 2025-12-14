import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const ProtectedRoute = () => {
  const token = useAppSelector((s) => s.auth.token);
  const effectiveToken = token || undefined;
  const location = useLocation();

  if (!effectiveToken) {
    if (import.meta.env.DEV) {
      console.debug('ProtectedRoute redirect', {
        path: location.pathname,
        reduxToken: token,
      });
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
