import { supabase } from '../../lib/supabaseClient';

export const asignacionesService = {
  async getAsignacionesByPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('asignaciones')
      .select('*, perfiles(*)')
      .eq('paciente_id', pacienteId);
    if (error) throw error;
    return data;
  },

  async addAsignacion(pacienteId, terapeutaId) {
    const { data, error } = await supabase
      .from('asignaciones')
      .insert([{ paciente_id: pacienteId, terapeuta_id: terapeutaId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeAsignacion(id) {
    const { error } = await supabase
      .from('asignaciones')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
