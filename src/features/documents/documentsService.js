import { supabase } from '../../lib/supabaseClient';

export const documentosService = {
  async getAllDocuments() {
    const { data, error } = await supabase
      .from('documentos')
      .select('*, pacientes(nombres, apellidos)')
      .order('creado_en', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getDocumentsByPaciente(pacienteId) {
    const { data, error } = await supabase
      .from('documentos')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('creado_en', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async getDocumentUrl(filePath) {
    const { data, error } = await supabase
      .storage
      .from('pdfs')
      .createSignedUrl(filePath, 3600); // 1 hora de validez
      
    if (error) throw error;
    return data.signedUrl;
  },

  async uploadDocument(file, pacienteId, titulo, descripcion, tipo, userId) {
    // 1. Subir archivo al bucket
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${pacienteId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Guardar registro en la base de datos
    const { data, error: dbError } = await supabase
      .from('documentos')
      .insert([{
        paciente_id: pacienteId,
        tipo,
        titulo,
        descripcion,
        ruta_archivo: filePath,
        subido_por: userId
      }])
      .select()
      .single();

    if (dbError) throw dbError;
    return data;
  }
};
