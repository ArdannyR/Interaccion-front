import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { terapeutasService } from './terapeutasService';
import { Card } from '../../components/Card';

export function TerapeutasList() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTerapeutas() {
      try {
        const data = await terapeutasService.getTerapeutas();
        setTerapeutas(data);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al cargar la lista de terapeutas.");
      } finally {
        setLoading(false);
      }
    }
    fetchTerapeutas();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">Terapeutas</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-[16rem]" />)}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center text-lg">
          {error}
        </div>
      ) : terapeutas.length === 0 ? (
        <div className="bg-(--color-surface) p-12 rounded-xl border border-(--color-border) text-center text-lg text-(--color-text-muted)">
          No se encontraron terapeutas activos.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-6">
          {terapeutas.map((t) => (
            <Card 
              key={t.id} 
              className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-all hover:border-(--color-primary-300) cursor-pointer"
              onClick={() => navigate(`/terapeutas/${t.id}`)}
            >
              <div className="w-24 h-24 bg-(--color-primary-100) rounded-full flex items-center justify-center text-(--color-primary-600) mb-4 shadow-sm">
                <span className="text-2xl font-bold uppercase">
                  {t.nombres?.charAt(0)}{t.apellidos?.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-(--color-text-main) line-clamp-2">
                {t.nombres} {t.apellidos}
              </h3>
              <p className="text-(--color-text-muted) mt-2 capitalize font-medium">
                {t.especialidad || 'Especialidad General'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
