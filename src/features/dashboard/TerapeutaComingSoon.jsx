import { useAuth } from '../../features/auth/AuthContext';
import { authService } from '../../features/auth/authService';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

export function TerapeutaComingSoon() {
  const { perfil } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-(--color-primary-50) via-(--color-background) to-(--color-primary-100)/40 -z-20 pointer-events-none" />
      <div className="bg-(--color-surface)/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-(--color-border)/50 max-w-md w-full text-center animate-fade-up">
        <h1 className="text-3xl font-bold text-(--color-primary-700) mb-4 bg-clip-text text-transparent bg-linear-to-r from-(--color-primary-700) to-(--color-primary-500)">
          ¡Hola, {perfil?.nombres}!
        </h1>
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
