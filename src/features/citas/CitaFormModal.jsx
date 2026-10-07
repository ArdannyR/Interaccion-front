import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { terapeutasService } from '../terapeutas/terapeutasService';
import { pacientesService } from '../pacientes/pacientesService';
import { citasService } from './citasService';
import { getHorasPermitidas, getLocalTodayDate, formatTime, isPastDateLocal } from '../../utils/fechas';
import { Button } from '../../components/Button';
import { DateInput } from '../../components/DateInput';
import { Spinner } from '../../components/Spinner';

export function CitaFormModal({ onClose, onSuccess, initialData = {}, lockPaciente = false, lockProfesional = false }) {
  const { perfil } = useAuth();
  
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  
  const [formData, setFormData] = useState({
    paciente_id: initialData.paciente_id || '',
    profesional_id: initialData.profesional_id || '',
    fecha: initialData.fecha || getLocalTodayDate(),
    hora_inicio: initialData.hora_inicio ? formatTime(initialData.hora_inicio) : '08:00',
    notas: initialData.notas || ''
  });

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Prevent weekend selection manually if native calendar allows it
  const handleChangeFecha = (e) => {
    const val = e.target.value;
    if (val) {
      const day = new Date(val + 'T00:00:00').getDay();
      if (day === 0 || day === 6) {
        setError('No se pueden programar citas los fines de semana.');
        return;
      }
    }
    setError('');
    setFormData(prev => ({ ...prev, fecha: val }));
  };

  useEffect(() => {
    async function loadOptions() {
      try {
        const [pacs, teraps] = await Promise.all([
          pacientesService.getPacientes(''),
          terapeutasService.getTerapeutas()
        ]);
        setPacientes(pacs);
        
        // El profesional puede ser "Yo" o terapeutas
        const profs = [];
        // Si no está bloqueado o si estoy yo bloqueado, me agrego
        if (!lockProfesional || formData.profesional_id === perfil?.id) {
           profs.push({ id: perfil?.id, nombre_mostrar: `Yo (${perfil?.nombres} ${perfil?.apellidos})` });
        }
        
        teraps.forEach(t => {
          if (t.id !== perfil?.id) {
            profs.push({ id: t.id, nombre_mostrar: `${t.nombres} ${t.apellidos} - ${t.especialidad || 'General'}` });
          }
        });
        
        setProfesionales(profs);
        
        // Si está bloqueado pero no hay id, selecciono el primero disponible
        if (!formData.profesional_id && profs.length > 0) {
          setFormData(prev => ({ ...prev, profesional_id: profs[0].id }));
        }

      } catch {
        setError('Error al cargar opciones.');
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, [perfil, lockProfesional, formData.profesional_id]);

  // Trap focus / close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isPastDateLocal(formData.fecha)) {
      setError('No se pueden crear citas en fechas pasadas.');
      return;
    }

    setSaving(true);
    try {
      if (initialData.id) {
        await citasService.updateCita(initialData.id, {
          pacienteId: formData.paciente_id,
          profesionalId: formData.profesional_id,
          fecha: formData.fecha,
          horaInicio: formData.hora_inicio,
          notas: formData.notas
        });
      } else {
        await citasService.createCita({
          pacienteId: formData.paciente_id,
          profesionalId: formData.profesional_id,
          fecha: formData.fecha,
          horaInicio: formData.hora_inicio,
          notas: formData.notas
        });
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al guardar cita.');
    } finally {
      setSaving(false);
    }
  };

  const horas = getHorasPermitidas();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-(--color-surface) rounded-2xl shadow-xl border border-(--color-border) w-full max-w-lg flex flex-col max-h-[90vh]"
        role="dialog" 
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-6 border-b border-(--color-border)">
          <h2 className="text-2xl font-bold text-(--color-text-main)">
            {initialData.id ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text-main) p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6">
              {error}
            </div>
          )}

          {loadingOptions ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : (
            <form id="cita-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-(--color-text-main)">Paciente *</label>
                <select
                  name="paciente_id"
                  value={formData.paciente_id}
                  onChange={handleChange}
                  required
                  disabled={lockPaciente}
                  className="w-full px-4 py-3 border border-(--color-border) rounded-xl bg-(--color-surface) text-lg disabled:bg-(--color-surface-hover) disabled:opacity-70"
                >
                  <option value="" disabled>Selecciona un paciente</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre_completo} ({p.cedula})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-(--color-text-main)">Profesional *</label>
                <select
                  name="profesional_id"
                  value={formData.profesional_id}
                  onChange={handleChange}
                  required
                  disabled={lockProfesional}
                  className="w-full px-4 py-3 border border-(--color-border) rounded-xl bg-(--color-surface) text-lg disabled:bg-(--color-surface-hover) disabled:opacity-70"
                >
                  <option value="" disabled>Selecciona profesional</option>
                  {profesionales.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre_mostrar}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DateInput
                  label="Fecha *"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChangeFecha}
                  min={getLocalTodayDate()}
                  required
                />
                
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-(--color-text-main)">Hora *</label>
                  <select
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-(--color-border) rounded-xl bg-(--color-surface) text-lg"
                  >
                    {horas.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-(--color-text-main)">Notas (opcional)</label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-(--color-border) rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) bg-(--color-surface) text-lg resize-y"
                  placeholder="Detalles adicionales..."
                ></textarea>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-(--color-border) flex justify-end gap-4 bg-(--color-surface-hover)">
          <Button variant="outline" type="button" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" form="cita-form" disabled={saving || loadingOptions}>
            {saving ? <Spinner size="sm" /> : 'Guardar Cita'}
          </Button>
        </div>
      </div>
    </div>
  );
}
