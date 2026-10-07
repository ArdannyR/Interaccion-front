import { getHorasPermitidas, getLocalTodayDate, addDaysLocal, formatTime } from '../../utils/fechas';

export function WeeklyCalendar({ citas = [], semanaInicio, onCambiarSemana, onClickCasillaVacia, onClickCita, modo }) {
  const horas = getHorasPermitidas();
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dias = diasSemana.map((nombre, i) => ({
    nombre,
    fecha: addDaysLocal(semanaInicio, i)
  }));
  const hoy = getLocalTodayDate();

  // Helper para buscar cita en una fecha/hora
  const getCita = (fecha, hora) => {
    return citas.find(c => c.fecha === fecha && formatTime(c.hora_inicio) === formatTime(hora));
  };

  const getCitaText = (cita) => {
    if (modo === 'profesional') return cita.pacientes?.nombre_completo || 'Paciente no encontrado';
    if (modo === 'paciente') return `${cita.perfiles?.nombres} ${cita.perfiles?.apellidos}`;
    return `${cita.pacientes?.nombre_completo} - ${cita.perfiles?.nombres}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-(--color-surface) p-4 rounded-xl border border-(--color-border) shadow-sm">
        <button 
          onClick={() => onCambiarSemana(-7)}
          className="text-(--color-primary-600) font-semibold px-4 py-2 hover:bg-(--color-primary-50) rounded-lg transition-colors"
        >
          &larr; Semana anterior
        </button>
        <div className="text-xl font-bold text-(--color-text-main) flex items-center gap-4">
          <span>{dias[0].fecha} a {dias[4].fecha}</span>
          <button 
            onClick={() => onCambiarSemana(0)}
            className="text-base text-(--color-text-muted) px-3 py-1 border border-(--color-border) hover:bg-(--color-surface-hover) rounded-lg"
          >
            Hoy
          </button>
        </div>
        <button 
          onClick={() => onCambiarSemana(7)}
          className="text-(--color-primary-600) font-semibold px-4 py-2 hover:bg-(--color-primary-50) rounded-lg transition-colors"
        >
          Semana siguiente &rarr;
        </button>
      </div>

      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) shadow-sm overflow-x-auto">
        <div className="min-w-[800px] p-6">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="font-semibold text-(--color-text-muted) text-center pt-2">Hora</div>
            {dias.map(d => {
              const esHoy = d.fecha === hoy;
              return (
                <div key={d.fecha} className="text-center flex flex-col items-center">
                  <span className={`font-semibold text-lg ${esHoy ? 'text-(--color-primary-700)' : 'text-(--color-text-main)'}`}>
                    {d.nombre}
                  </span>
                  <span className={`text-sm mt-1 px-3 py-1 rounded-full ${esHoy ? 'bg-(--color-primary-500) text-white font-bold' : 'text-(--color-text-muted)'}`}>
                    {d.fecha.split('-')[2]}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-4">
            {horas.map(hora => (
              <div key={hora} className="grid grid-cols-6 gap-4">
                <div className="text-center font-medium text-(--color-text-muted) py-2">{formatTime(hora)}</div>
                {dias.map(d => {
                  const cita = getCita(d.fecha, hora);
                  const isPast = d.fecha < hoy;

                  if (cita) {
                    return (
                      <button 
                        key={`${d.fecha}-${hora}`}
                        onClick={() => onClickCita(cita)}
                        className="bg-(--color-primary-50) border-2 border-(--color-primary-300) rounded-lg p-2 text-left hover:bg-(--color-primary-100) transition-colors flex flex-col min-h-[5rem] overflow-hidden group"
                      >
                        <span className="font-semibold text-(--color-primary-800) line-clamp-2 leading-snug">
                          {getCitaText(cita)}
                        </span>
                        <span className="text-xs text-(--color-primary-600) font-medium mt-auto pt-1 opacity-80 group-hover:opacity-100">
                          {formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}
                        </span>
                      </button>
                    );
                  }

                  return (
                    <button 
                      key={`${d.fecha}-${hora}`} 
                      disabled={isPast}
                      onClick={() => onClickCasillaVacia(d.fecha, hora)}
                      className={`border-2 border-dashed border-(--color-border) rounded-lg p-2 text-center text-sm transition-colors min-h-[5rem] ${
                        isPast 
                          ? 'bg-(--color-surface-hover) opacity-50 cursor-not-allowed' 
                          : 'hover:bg-(--color-primary-50) hover:border-(--color-primary-300) hover:text-(--color-primary-700) text-transparent cursor-pointer'
                      } flex items-center justify-center group`}
                    >
                      {!isPast && <span className="group-hover:opacity-100 opacity-0 font-medium">+ Agregar</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
