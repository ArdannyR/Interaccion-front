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
        navigate('/dashboard');
      } else if (perfil?.rol === 'terapeuta') {
        navigate('/mis-pacientes');
      } else {
        // En caso de que un paciente u otro rol intente ingresar, lo mandamos al index por ahora
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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="p-6">
        <Link to="/" className="text-2xl font-bold text-teal-800 hover:text-teal-900 transition-colors">
          &larr; Volver a {CLINIC_INFO.name}
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Ingresar al sistema</h1>
            <p className="text-lg text-stone-600 mt-2">Acceso para personal del consultorio</p>
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
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-lg border border-red-100">
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
