import { useState, useEffect } from 'react';
import { getHorasPermitidas, getLocalTodayDate, addDaysLocal, formatTime } from '../../utils/fechas';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function WeeklyCalendar({ citas = [], semanaInicio, onCambiarSemana, onClickCasillaVacia, onClickCita, modo }) {
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const horas = getHorasPermitidas();
  const hoy = getLocalTodayDate();

  const diasSemana = [
    { letra: 'L', nombre: 'Lunes' },
    { letra: 'M', nombre: 'Martes' },
    { letra: 'X', nombre: 'Miércoles' },
    { letra: 'J', nombre: 'Jueves' },
    { letra: 'V', nombre: 'Viernes' }
  ];

  const dias = diasSemana.map((d, i) => ({
    ...d,
    fecha: addDaysLocal(semanaInicio, i)
  }));

  // Lógica móvil: pre-seleccionar "hoy" si es día de la semana mostrada, o el lunes.
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    const idx = dias.findIndex(d => d.fecha === hoy);
    if (idx !== -1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDayIndex(idx);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDayIndex(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semanaInicio]);

  const getCita = (fecha, hora) => {
    return citas.find(c => c.fecha === fecha && formatTime(c.hora_inicio) === formatTime(hora));
  };

  const getCitaText = (cita) => {
    if (modo === 'profesional') return cita.pacientes?.nombre_completo || 'Paciente';
    if (modo === 'paciente') return `${cita.perfiles?.nombres} ${cita.perfiles?.apellidos}`;
    return `${cita.pacientes?.nombre_completo} - ${cita.perfiles?.nombres}`;
  };

  const formatRango = () => {
    const d1 = new Date(dias[0].fecha + 'T00:00:00');
    const d2 = new Date(dias[4].fecha + 'T00:00:00');
    const m1 = d1.toLocaleDateString('es-ES', { month: 'short' });
    const m2 = d2.toLocaleDateString('es-ES', { month: 'short' });
    const y2 = d2.getFullYear();
    if (m1 === m2) {
      return `${d1.getDate()} – ${d2.getDate()} ${m2} ${y2}`;
    }
    return `${d1.getDate()} ${m1} – ${d2.getDate()} ${m2} ${y2}`;
  };

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Barra de controles compacta */}
      <div className="flex justify-between items-center bg-(--color-surface) p-3 rounded-xl border border-(--color-border) shadow-sm gap-2">
        <button 
          onClick={() => onCambiarSemana(-7)}
          aria-label="Semana anterior"
          className="p-2 text-(--color-text-muted) hover:text-(--color-primary-600) hover:bg-(--color-primary-50) rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-(--color-text-main) capitalize">{formatRango()}</span>
          <button 
            onClick={() => onCambiarSemana(0)}
            className="text-sm font-medium text-(--color-primary-600) hover:underline"
          >
            Hoy
          </button>
        </div>
        <button 
          onClick={() => onCambiarSemana(7)}
          aria-label="Semana siguiente"
          className="p-2 text-(--color-text-muted) hover:text-(--color-primary-600) hover:bg-(--color-primary-50) rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="bg-(--color-surface) rounded-xl border border-(--color-border) shadow-sm overflow-hidden">
        
        {/* VISTA MÓVIL */}
        {!isDesktop && (
          <div className="flex flex-col">
            {/* Tabs de días */}
            <div className="flex border-b border-(--color-border)">
              {dias.map((d, i) => {
                const isSelected = selectedDayIndex === i;
                const isHoy = d.fecha === hoy;
                return (
                  <button
                    key={d.fecha}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`flex-1 py-3 flex flex-col items-center transition-colors ${
                      isSelected 
                        ? 'border-b-2 border-(--color-primary-600) bg-(--color-primary-50)' 
                        : 'hover:bg-(--color-surface-hover)'
                    }`}
                  >
                    <span className={`text-sm font-bold ${isSelected ? 'text-(--color-primary-700)' : 'text-(--color-text-muted)'}`}>
                      {d.letra}
                    </span>
                    <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                      isHoy ? 'bg-(--color-primary-500) text-white' : (isSelected ? 'text-(--color-primary-800)' : 'text-(--color-text-muted)')
                    }`}>
                      {d.fecha.split('-')[2]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Lista de horas para el día seleccionado */}
            <div className="p-2 space-y-2">
              {horas.map(hora => {
                const diaSel = dias[selectedDayIndex];
                const cita = getCita(diaSel.fecha, hora);
                const isPast = diaSel.fecha < hoy;

                return (
                  <div key={hora} className="flex gap-2 items-stretch h-[3rem]">
                    <div className="w-[3rem] shrink-0 text-right pr-2 text-sm text-(--color-text-muted) font-medium self-center">
                      {formatTime(hora)}
                    </div>
                    {cita ? (
                      <button 
                        onClick={() => onClickCita(cita)}
                        className="flex-1 bg-linear-to-br from-(--color-primary-100) to-(--color-primary-200) border-l-[3px] border-(--color-primary-500) rounded-r-lg shadow-sm p-2 text-left hover:-translate-y-[1px] hover:shadow-md transition-all group overflow-hidden"
                      >
                        <div className="font-semibold text-(--color-primary-800) truncate leading-tight">
                          {getCitaText(cita)}
                        </div>
                        <div className="text-xs text-(--color-primary-700) opacity-80 mt-1">
                          {formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}
                        </div>
                      </button>
                    ) : (
                      <button 
                        disabled={isPast}
                        onClick={() => onClickCasillaVacia(diaSel.fecha, hora)}
                        className={`flex-1 rounded-r-lg border border-dashed border-(--color-border) flex items-center justify-center transition-colors ${
                          isPast 
                            ? 'bg-(--color-surface-hover) opacity-50 cursor-not-allowed' 
                            : 'hover:bg-(--color-primary-50) hover:border-(--color-primary-300) hover:text-(--color-primary-600) text-transparent cursor-pointer group'
                        }`}
                      >
                        {!isPast && <span className="text-xl group-hover:opacity-100 opacity-0 transition-opacity">+</span>}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VISTA ESCRITORIO */}
        {isDesktop && (
          <div className="max-h-[calc(100dvh-13rem)] overflow-y-auto">
            <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] gap-1 p-2">
              
              {/* Header sticky */}
              <div className="sticky top-0 z-20 bg-(--color-surface) pb-2 border-b border-(--color-border)"></div>
              {dias.map(d => {
                const isHoy = d.fecha === hoy;
                return (
                  <div key={d.fecha} className="sticky top-0 z-20 bg-(--color-surface) pb-2 border-b border-(--color-border) text-center flex flex-col items-center justify-end">
                    <span className="font-semibold text-sm text-(--color-text-main)">{d.letra}</span>
                    <span className={`text-sm mt-0.5 px-2 py-0.5 rounded-full ${
                      isHoy 
                        ? 'bg-(--color-primary-500) text-white font-bold ring-2 ring-(--color-primary-300) ring-offset-1 ring-offset-(--color-surface)' 
                        : 'text-(--color-text-muted)'
                    }`}>
                      {d.fecha.split('-')[2]}
                    </span>
                  </div>
                );
              })}

              {/* Grid content */}
              {horas.map(hora => (
                <div key={hora} className="contents group">
                  <div className="text-xs text-(--color-text-muted) font-medium text-right pr-1 pt-1 h-[2.75rem]">
                    {formatTime(hora)}
                  </div>
                  {dias.map(d => {
                    const cita = getCita(d.fecha, hora);
                    const isPast = d.fecha < hoy;

                    if (cita) {
                      return (
                        <button 
                          key={`${d.fecha}-${hora}`}
                          onClick={() => onClickCita(cita)}
                          title={`${formatTime(cita.hora_inicio)} - ${formatTime(cita.hora_fin)} | ${getCitaText(cita)}`}
                          className="h-[2.75rem] bg-linear-to-br from-(--color-primary-100) to-(--color-primary-200) border-l-[3px] border-(--color-primary-500) rounded shadow-sm px-2 py-1 text-left hover:-translate-y-[1px] hover:shadow-md transition-all flex flex-col justify-center overflow-hidden"
                        >
                          <span className="font-semibold text-sm text-(--color-primary-800) truncate">
                            {getCitaText(cita)}
                          </span>
                          <span className="hidden lg:block text-[0.65rem] text-(--color-primary-700) truncate leading-none">
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
                        className={`h-[2.75rem] border border-dashed border-(--color-border) rounded transition-colors flex items-center justify-center ${
                          isPast 
                            ? 'bg-(--color-surface-hover) opacity-50 cursor-not-allowed' 
                            : 'hover:bg-(--color-primary-50) hover:border-(--color-primary-300) hover:text-(--color-primary-600) text-transparent cursor-pointer empty-cell'
                        }`}
                      >
                        {!isPast && <span className="text-lg opacity-0 hover:opacity-100 transition-opacity">+</span>}
                      </button>
                    );
                  })}
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
