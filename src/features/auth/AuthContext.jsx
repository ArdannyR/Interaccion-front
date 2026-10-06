import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      try {
        const currentSession = await authService.getSession();
        if (mounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            const profile = await authService.getProfile(currentSession.user.id);
            setPerfil(profile);
          }
        }
      } catch (err) {
        console.error('Error al cargar sesión:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAuth();

    const { data: { subscription } } = authService.onAuthStateChange(async (newSession) => {
      if (mounted) {
        setSession(newSession);
        if (newSession?.user) {
          const profile = await authService.getProfile(newSession.user.id);
          setPerfil(profile);
        } else {
          setPerfil(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, perfil, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-xl text-stone-500 font-medium">Cargando tu cuenta...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
