import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from './authService';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { CLINIC_INFO } from '../landing/constants';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.login(email, password);
      const perfil = await authService.getProfile(data.user.id);
      
      if (perfil?.rol === 'directora') {
        navigate('/pacientes');
      } else if (perfil?.rol === 'terapeuta') {
        navigate('/tu-espacio');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes('Invalid login credentials')) {
        setError('El correo o la contraseña no son correctos.');
      } else {
        setError('Ocurrió un problema al intentar ingresar. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute inset-0 bg-linear-to-br from-(--color-primary-50) via-(--color-background) to-(--color-primary-100)/40 -z-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-(--color-primary-300)/20 rounded-full blur-3xl animate-float -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-(--color-primary-400)/20 rounded-full blur-3xl animate-float -z-10 pointer-events-none" style={{ animationDelay: '-10s' }} />

      <header className="p-6 relative z-10">
        <Link 
          to="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-(--color-primary-700) to-(--color-primary-500) hover:from-(--color-primary-800) hover:to-(--color-primary-600) transition-all inline-block"
        >
          &larr; Volver a {CLINIC_INFO.name}
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <Card className="w-full max-w-md p-8 shadow-2xl border border-white/50 bg-(--color-surface)/80 backdrop-blur-xl animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-(--color-text-main)">Ingresar al sistema</h1>
            <p className="text-lg text-(--color-text-muted) mt-2">Acceso para personal del consultorio</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              disabled={loading}
              required
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />

            {error && (
              <div className="p-4 bg-red-50/90 backdrop-blur-sm text-red-700 rounded-xl text-lg border border-red-200 animate-fade-up">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full text-xl py-4 mt-2" 
              isLoading={loading}
            >
              Entrar
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
