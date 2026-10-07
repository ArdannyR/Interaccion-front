import { supabase } from '../../lib/supabaseClient';
import { addMinutesToTime, DURACION_CITA_MIN } from '../../utils/fechas';

export const citasService = {
  async getCitas({ desde, hasta, profesionalId, pacienteId }) {
    let query = supabase
      .from('citas')
      .select('*, pacientes(id, nombre_completo), perfiles!profesional_id(id, nombres, apellidos, especialidad)')
      .eq('estado', 'programada');

    if (desde) query = query.gte('fecha', desde);
    if (hasta) query = query.lte('fecha', hasta);
    if (profesionalId) query = query.eq('profesional_id', profesionalId);
    if (pacienteId) query = query.eq('paciente_id', pacienteId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createCita({ pacienteId, profesionalId, fecha, horaInicio, notas }) {
    const horaFin = addMinutesToTime(horaInicio, DURACION_CITA_MIN);
    
    const { data, error } = await supabase
      .from('citas')
      .insert([{
        paciente_id: pacienteId,
        profesional_id: profesionalId,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        notas
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23P01') {
        throw new Error("Esa persona ya tiene una cita a esa hora. Elige otro horario.");
      }
      throw error;
    }
    return data;
  },

  async updateCita(id, { pacienteId, profesionalId, fecha, horaInicio, notas }) {
    const horaFin = addMinutesToTime(horaInicio, DURACION_CITA_MIN);
    
    const { data, error } = await supabase
      .from('citas')
      .update({
        paciente_id: pacienteId,
        profesional_id: profesionalId,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        notas
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23P01') {
        throw new Error("Esa persona ya tiene una cita a esa hora. Elige otro horario.");
      }
      throw error;
    }
    return data;
  },

  async cancelCita(id) {
    const { error } = await supabase
      .from('citas')
      .update({ estado: 'cancelada' })
      .eq('id', id);
    if (error) throw error;
  }
};
