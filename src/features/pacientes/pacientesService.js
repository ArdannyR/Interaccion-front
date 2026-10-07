import { supabase } from '../../lib/supabaseClient';

export const pacientesService = {
  async getPacientes(search = '') {
    let query = supabase
      .from('pacientes')
      .select('*, planes_tratamiento(id, diagnostico, fecha)')
      .eq('activo', true)
      .order('nombre_completo', { ascending: true });

    if (search) {
      const isOnlyDigits = /^\d+$/.test(search);
      if (isOnlyDigits) {
        query = query.ilike('cedula', `%${search}%`);
      } else {
        query = query.ilike('nombre_completo', `%${search}%`);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Process planes_tratamiento to keep only the most recent one
    return data.map(paciente => {
      let latestPlan = null;
      if (paciente.planes_tratamiento && paciente.planes_tratamiento.length > 0) {
        const sortedPlanes = [...paciente.planes_tratamiento].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        latestPlan = sortedPlanes[0];
      }
      return {
        ...paciente,
        latestPlan,
      };
    });
  },

  async getPaciente(id) {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*, planes_tratamiento(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    if (data.planes_tratamiento) {
      data.planes_tratamiento.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
    return data;
  },

  async createPaciente(paciente) {
    const { data, error } = await supabase
      .from('pacientes')
      .insert([paciente])
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') {
        throw new Error("Ya existe un paciente con esta cédula");
      }
      throw error;
    }
    return data;
  },

  async updatePaciente(id, updates) {
    const { data, error } = await supabase
      .from('pacientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') {
        throw new Error("Ya existe un paciente con esta cédula");
      }
      throw error;
    }
    return data;
  },

  async deactivatePaciente(id) {
    const { error } = await supabase
      .from('pacientes')
      .update({ activo: false })
      .eq('id', id);
    if (error) throw error;
  },

  async createPlan(plan) {
    const { data, error } = await supabase
      .from('planes_tratamiento')
      .insert([plan])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updatePlan(id, updates) {
    const { data, error } = await supabase
      .from('planes_tratamiento')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getPlan(id) {
    const { data, error } = await supabase
      .from('planes_tratamiento')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
};
