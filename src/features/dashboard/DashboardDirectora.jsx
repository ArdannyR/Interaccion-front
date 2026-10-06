import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useAuth } from '../auth/AuthContext';
import { authService } from '../auth/authService';
import { Button } from '../../components/Button';
import { CLINIC_INFO } from '../landing/constants';

export function DashboardDirectora() {
  const { perfil } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-800">{CLINIC_INFO.name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-stone-600 font-medium hidden sm:inline">Hola, {perfil?.nombres}</span>
            <Button variant="secondary" onClick={() => authService.logout()}>Salir</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <h2 className="text-4xl font-bold text-stone-900 mb-2">Panel de Administración</h2>
        <p className="text-xl text-stone-600 mb-10">Selecciona el área que deseas gestionar.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/pacientes" className="group">
            <Card className="h-full p-8 text-center hover:border-teal-500 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">P</div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2 group-hover:text-teal-700">Pacientes</h3>
              <p className="text-lg text-stone-600">Gestionar historial clínico y asignaciones</p>
            </Card>
          </Link>
          
          <Link to="/terapeutas" className="group">
            <Card className="h-full p-8 text-center hover:border-teal-500 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-sky-100 text-sky-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">T</div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2 group-hover:text-teal-700">Terapeutas</h3>
              <p className="text-lg text-stone-600">Ver personal e historial de asignaciones</p>
            </Card>
          </Link>
          
          <Link to="/documentos" className="group">
            <Card className="h-full p-8 text-center hover:border-teal-500 hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">D</div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2 group-hover:text-teal-700">Documentos</h3>
              <p className="text-lg text-stone-600">Acceso a todos los PDFs subidos</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
