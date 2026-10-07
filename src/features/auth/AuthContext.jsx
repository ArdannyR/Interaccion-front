import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar sesión inicial y escuchar cambios de auth
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const currentSession = await authService.getSession();
        if (mounted) setSession(currentSession);
      } catch (err) {
        console.error('Error al cargar sesión inicial:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    const { data: { subscription } } = authService.onAuthStateChange((newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // 2. Efecto separado para cargar el perfil basado en la sesión
  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!session?.user?.id) {
        if (mounted) setPerfil(null);
        return;
      }
      try {
        const profile = await authService.getProfile(session.user.id);
        if (mounted) setPerfil(profile);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider value={{ session, perfil, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-(--color-background)">
          <div className="text-xl text-(--color-text-muted) font-medium">Cargando tu cuenta...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
