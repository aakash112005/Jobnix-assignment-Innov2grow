import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

/**
 * Restricts a route subtree to specific roles. Must be nested inside
 * <ProtectedRoute /> so `user` is guaranteed to exist once bootstrapped.
 */
const RoleRoute = ({ roles = [] }) => {
  const { user, bootstrapped } = useSelector((state) => state.auth);

  if (!bootstrapped) return <Loader fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;
