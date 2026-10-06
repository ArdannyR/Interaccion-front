import { supabase } from '../../lib/supabaseClient';

export const pacientesService = {
  async getPacientes(search = '') {
    let query = supabase
      .from('pacientes')
      .select('*')
      .eq('activo', true)
      .order('nombres', { ascending: true });

    if (search) {
      query = query.or(`nombres.ilike.%${search}%,apellidos.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getPaciente(id) {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createPaciente(paciente) {
    const { data, error } = await supabase
      .from('pacientes')
      .insert([paciente])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePaciente(id, updates) {
    const { data, error } = await supabase
      .from('pacientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deactivatePaciente(id) {
    const { error } = await supabase
      .from('pacientes')
      .update({ activo: false })
      .eq('id', id);
    if (error) throw error;
  }
};
