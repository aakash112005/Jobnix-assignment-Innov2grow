import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

const ProtectedRoute = () => {
  const { user, bootstrapped } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!bootstrapped) return <Loader fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
