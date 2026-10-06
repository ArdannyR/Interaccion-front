import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';

export function RoleRoute({ allowedRoles }) {
  const { session, perfil } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!perfil || !allowedRoles.includes(perfil.rol)) {
    // Si no tiene el rol correcto, lo devolvemos a login o inicio
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
