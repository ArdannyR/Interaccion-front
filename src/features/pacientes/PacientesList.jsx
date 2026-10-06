import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';

export function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    async function fetchPacientes() {
      setLoading(true);
      try {
        const data = await pacientesService.getPacientes(search);
        setPacientes(data);
      } catch (err) {
        console.error("Error al cargar la lista de pacientes");
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search
    timer = setTimeout(fetchPacientes, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-stone-900">Pacientes</h2>
          <Link to="/dashboard" className="text-teal-700 hover:underline mt-2 inline-block">&larr; Volver al panel</Link>
        </div>
        <Link to="/pacientes/nuevo">
          <Button>+ Nuevo paciente</Button>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <Input 
          placeholder="Buscar por nombre o apellido..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {loading ? (
        <Spinner />
      ) : pacientes.length === 0 ? (
        <Card className="p-12 text-center text-lg text-stone-600">
          No se encontraron pacientes.
        </Card>
      ) : (
        <div className="grid gap-4">
          {pacientes.map((p) => (
            <Card key={p.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-stone-900">{p.nombres} {p.apellidos}</h3>
                <p className="text-stone-600">Tel: {p.telefono || 'Sin registro'} | Rep: {p.representante || 'N/A'}</p>
              </div>
              <Link to={`/pacientes/${p.id}`}>
                <Button variant="outline">Ver y Editar</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
