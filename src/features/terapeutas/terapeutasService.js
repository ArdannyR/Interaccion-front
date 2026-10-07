import { supabase } from '../../lib/supabaseClient';

export const terapeutasService = {
  async getTerapeutas() {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('rol', 'terapeuta')
      .eq('activo', true)
      .order('nombres', { ascending: true });
      
    if (error) throw error;
    return data;
  },

  async getTerapeuta(id) {
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateTerapeuta(id, updates) {
    const { data, error } = await supabase
      .from('perfiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

};
