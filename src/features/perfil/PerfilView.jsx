import { useAuth } from '../auth/AuthContext';
import { Card } from '../../components/Card';

export function PerfilView() {
  const { perfil } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">Mi Perfil</h1>
      
      <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar Genérico */}
          <div className="w-32 h-32 rounded-full bg-(--color-primary-100) flex items-center justify-center text-(--color-primary-600)">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
          </div>
          <button 
            disabled 
            className="px-4 py-2 bg-(--color-surface-hover) text-(--color-text-muted) rounded-lg font-medium cursor-not-allowed opacity-70"
          >
            Subir foto (Próximamente)
          </button>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <label className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider">Nombres y Apellidos</label>
            <p className="text-2xl font-bold text-(--color-text-main)">{perfil?.nombres} {perfil?.apellidos}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider">Rol</label>
              <p className="text-lg text-(--color-text-main) capitalize">{perfil?.rol}</p>
            </div>
            
            {perfil?.especialidad && (
              <div>
                <label className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider">Especialidad</label>
                <p className="text-lg text-(--color-text-main)">{perfil?.especialidad}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
