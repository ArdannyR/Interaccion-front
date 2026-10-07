import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { PacienteCard } from './PacienteCard';

export function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer;
    async function fetchPacientes() {
      setLoading(true);
      setError(null);
      try {
        const data = await pacientesService.getPacientes(search);
        setPacientes(data);
      } catch (err) {
        console.error("Error al cargar la lista de pacientes", err);
        setError("Ocurrió un error al cargar la lista de pacientes.");
      } finally {
        setLoading(false);
      }
    }
    
    // Debounce search
    timer = setTimeout(fetchPacientes, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">Pacientes</h1>
        <Link to="/pacientes/nuevo">
          <Button className="text-lg py-3 px-6">+ Añadir paciente</Button>
        </Link>
      </div>

      <div className="bg-(--color-surface) p-4 rounded-xl border border-(--color-border) shadow-sm">
        <Input 
          placeholder="Buscar por número de cédula o nombre completo..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-lg w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center text-lg">
          {error}
        </div>
      ) : pacientes.length === 0 ? (
        <div className="bg-(--color-surface) p-12 rounded-xl border border-(--color-border) text-center text-lg text-(--color-text-muted)">
          No se encontraron pacientes.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {pacientes.map((p) => (
            <PacienteCard key={p.id} paciente={p} />
          ))}
        </div>
      )}
    </div>
  );
}
