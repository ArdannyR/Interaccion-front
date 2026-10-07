import { useAuth } from '../../features/auth/AuthContext';
import { authService } from '../../features/auth/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

export function TerapeutaComingSoon() {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--color-background) p-4">
      <div className="bg-(--color-surface) p-8 rounded-2xl shadow-sm border border-(--color-border) max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-(--color-primary-700) mb-4">¡Hola, {perfil?.nombres}!</h1>
        <p className="text-xl text-(--color-text-main) mb-8">
          Tu espacio estará disponible pronto.
        </p>
        <Button onClick={handleLogout} className="w-full text-lg py-3">
          Salir
        </Button>
      </div>
    </div>
  );
}
