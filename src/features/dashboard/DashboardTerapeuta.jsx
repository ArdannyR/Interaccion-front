import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { useAuth } from '../auth/AuthContext';
import { authService } from '../auth/authService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { pacientesService } from '../pacientes/pacientesService';
import { CLINIC_INFO } from '../landing/constants';

export function DashboardTerapeuta() {
  const { perfil } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPacientes() {
      try {
        // En RLS ya está filtrado por los asignados al terapeuta,
        // así que podemos usar el endpoint general de pacientes de forma segura.
        const data = await pacientesService.getPacientes();
        setPacientes(data);
      } catch (err) {
        console.error("Error al cargar la lista de pacientes");
      } finally {
        setLoading(false);
      }
    }
    fetchPacientes();
  }, []);

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
        <h2 className="text-4xl font-bold text-stone-900 mb-2">Mis Pacientes Asignados</h2>
        <p className="text-xl text-stone-600 mb-10">Accede al expediente y documentos de tus pacientes.</p>

        {loading ? (
          <Spinner />
        ) : pacientes.length === 0 ? (
          <Card className="p-12 text-center text-lg text-stone-600">
            Aún no tienes pacientes asignados.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientes.map((p) => (
              <Card key={p.id} className="p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-stone-800 mb-1">{p.nombres} {p.apellidos}</h3>
                  <p className="text-stone-600 mb-2">Representante: {p.representante || 'N/A'}</p>
                </div>
                <div className="pt-4 mt-2 border-t border-stone-100">
                  <Link to={`/pacientes/${p.id}/ver`}>
                    <Button className="w-full">Ver Expediente</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
