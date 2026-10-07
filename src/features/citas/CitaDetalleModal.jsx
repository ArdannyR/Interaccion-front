import { useState } from 'react';
import { Button } from '../../components/Button';
import { formatTime } from '../../utils/fechas';
import { Spinner } from '../../components/Spinner';

export function CitaDetalleModal({ cita, onClose, onEdit, onCancelCita }) {
  const [canceling, setCanceling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!cita) return null;

  const handleCancel = async () => {
    setCanceling(true);
    await onCancelCita(cita.id);
    setCanceling(false);
  };

  const fechaFormateada = new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-(--color-surface) rounded-2xl shadow-xl border border-(--color-border) w-full max-w-md flex flex-col"
        role="dialog" 
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
          <h2 className="text-2xl font-bold text-(--color-text-main)">Detalle de Cita</h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text-main) p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div>
            <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Fecha y Hora</p>
            <p className="text-lg text-(--color-text-main) font-medium capitalize mt-1">{fechaFormateada}</p>
            <p className="text-xl font-bold text-(--color-primary-700)">{formatTime(cita.hora_inicio)} - {formatTime(cita.hora_fin)}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Paciente</p>
            <p className="text-xl text-(--color-text-main) font-medium mt-1">{cita.pacientes?.nombre_completo}</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Profesional</p>
            <p className="text-lg text-(--color-text-main) mt-1">{cita.perfiles?.nombres} {cita.perfiles?.apellidos}</p>
          </div>

          {cita.notas && (
            <div className="bg-(--color-primary-50) p-4 rounded-xl border border-(--color-primary-200)">
              <p className="text-sm font-semibold text-(--color-primary-800) mb-1">Notas</p>
              <p className="text-(--color-primary-900) whitespace-pre-wrap">{cita.notas}</p>
            </div>
          )}

          {showConfirm && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
              <p className="text-red-800 font-semibold mb-3">¿Seguro que desea cancelar esta cita?</p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100" onClick={() => setShowConfirm(false)} disabled={canceling}>No, volver</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel} disabled={canceling}>
                  {canceling ? <Spinner size="sm" /> : 'Sí, cancelar'}
                </Button>
              </div>
            </div>
          )}

        </div>

        {!showConfirm && (
          <div className="p-6 border-t border-(--color-border) flex justify-between bg-(--color-surface-hover) rounded-b-2xl">
            <button 
              onClick={() => setShowConfirm(true)}
              className="text-red-600 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancelar cita
            </button>
            <Button onClick={() => onEdit(cita)}>
              Editar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
