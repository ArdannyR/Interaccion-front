import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { terapeutasService } from './terapeutasService';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';

export function TerapeutasList() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTerapeutas() {
      try {
        const data = await terapeutasService.getTerapeutas();
        setTerapeutas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTerapeutas();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-stone-900">Terapeutas</h2>
        <Link to="/dashboard" className="text-teal-700 hover:underline mt-2 inline-block">&larr; Volver al panel</Link>
      </div>

      {loading ? (
        <Spinner />
      ) : terapeutas.length === 0 ? (
        <Card className="p-12 text-center text-lg text-stone-600">
          No se encontraron terapeutas registrados.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {terapeutas.map((t) => (
            <Card key={t.id} className="p-6 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">{t.nombres} {t.apellidos}</h3>
              <p className="text-lg text-stone-600 mb-1">Especialidad: {t.especialidad || 'General'}</p>
              <p className="text-lg font-medium text-teal-800">
                Pacientes asignados: {t.asignaciones?.[0]?.count || 0}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
