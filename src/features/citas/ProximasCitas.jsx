import { formatTime } from '../../utils/fechas';
import { Card } from '../../components/Card';

export function ProximasCitas({ citas = [], modo = 'completo', onClickCita }) {
  if (citas.length === 0) {
    return (
      <Card className="p-6 text-center text-(--color-text-muted)">
        No hay próximas citas programadas.
      </Card>
    );
  }

  // Ordenar por fecha y luego por hora
  const sorted = [...citas].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.hora_inicio.localeCompare(b.hora_inicio);
  }).slice(0, 5); // Mostrar solo las próximas 5

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-(--color-surface-hover) border-b border-(--color-border)">
        <h3 className="font-bold text-(--color-text-main)">Próximas Citas</h3>
      </div>
      <div className="divide-y divide-(--color-border)">
        {sorted.map(cita => {
          const date = new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
          let textoPrincipal;
          if (modo === 'profesional') textoPrincipal = cita.pacientes?.nombre_completo;
          else if (modo === 'paciente') textoPrincipal = `${cita.perfiles?.nombres} ${cita.perfiles?.apellidos}`;
          else textoPrincipal = `${cita.pacientes?.nombre_completo} con ${cita.perfiles?.nombres}`;

          return (
            <button 
              key={cita.id} 
              onClick={() => onClickCita && onClickCita(cita)}
              className="w-full p-4 flex justify-between items-center text-left hover:bg-(--color-primary-50) transition-colors group"
            >
              <div>
                <p className="font-semibold text-(--color-text-main) group-hover:text-(--color-primary-700)">{textoPrincipal}</p>
                <p className="text-sm text-(--color-text-muted) capitalize">{date}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-(--color-primary-600)">{formatTime(cita.hora_inicio)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
