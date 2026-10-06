import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { asignacionesService } from '../asignaciones/asignacionesService';
import { terapeutasService } from '../terapeutas/terapeutasService';
import { documentosService } from '../documents/documentsService';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { DocumentCard } from '../documents/DocumentCard';
import { Input } from '../../components/Input';

export function PacienteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { perfil } = useAuth();
  
  const [paciente, setPaciente] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Assign Therapist
  const [terapeutas, setTerapeutas] = useState([]);
  const [selectedTerapeuta, setSelectedTerapeuta] = useState('');
  const [assigning, setAssigning] = useState(false);

  // States for Upload Doc
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [docTitulo, setDocTitulo] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docTipo, setDocTipo] = useState('otro');

  useEffect(() => {
    async function loadData() {
      try {
        const [pacData, asigData, docData, terData] = await Promise.all([
          pacientesService.getPaciente(id),
          asignacionesService.getAsignacionesByPaciente(id),
          documentosService.getDocumentsByPaciente(id),
          terapeutasService.getTerapeutas()
        ]);
        setPaciente(pacData);
        setAsignaciones(asigData);
        setDocumentos(docData);
        setTerapeutas(terData);
      } catch (err) {
        console.error("Error al cargar la información del paciente");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDeactivate = async () => {
    if (window.confirm('¿Seguro que desea desactivar a este paciente? (No se borrará, pero no aparecerá en las listas activas)')) {
      try {
        await pacientesService.deactivatePaciente(id);
        navigate('/pacientes');
      } catch (error) {
        console.error("Error al desactivar el paciente");
        alert('Error al desactivar el paciente.');
      }
    }
  };

  const handleAddAsignacion = async (e) => {
    e.preventDefault();
    if (!selectedTerapeuta) return;
    setAssigning(true);
    try {
      await asignacionesService.addAsignacion(id, selectedTerapeuta);
      const asigData = await asignacionesService.getAsignacionesByPaciente(id);
      setAsignaciones(asigData);
      setSelectedTerapeuta('');
    } catch (err) {
      console.error("Error al asignar terapeuta");
      alert('Error al asignar terapeuta. Es posible que ya esté asignado.');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveAsignacion = async (asigId) => {
    if (window.confirm('¿Seguro que desea quitar a este terapeuta del caso?')) {
      try {
        await asignacionesService.removeAsignacion(asigId);
        setAsignaciones(asignaciones.filter(a => a.id !== asigId));
      } catch (err) {
        console.error("Error al cargar la información del paciente");
        alert('Error al quitar terapeuta.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    // Validate PDF and size (e.g., 5MB max)
    if (file.type !== 'application/pdf') {
      alert('Por favor selecciona un archivo PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es muy grande. El tamaño máximo es 5MB.');
      return;
    }

    setUploading(true);
    try {
      await documentosService.uploadDocument(file, id, docTitulo, docDesc, docTipo, perfil.id);
      const docData = await documentosService.getDocumentsByPaciente(id);
      setDocumentos(docData);
      
      // Reset form
      setFile(null);
      setDocTitulo('');
      setDocDesc('');
      setDocTipo('otro');
      e.target.reset(); // clear file input visually
    } catch (err) {
      console.error("Error al asignar terapeuta");
      alert('Error al subir el documento.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-10"><Spinner /></div>;
  if (!paciente) return <div className="p-10 text-center text-xl">Paciente no encontrado.</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-stone-900">{paciente.nombres} {paciente.apellidos}</h2>
          <Link to="/pacientes" className="text-teal-700 hover:underline mt-2 inline-block">&larr; Volver a Pacientes</Link>
        </div>
        <div className="flex gap-2">
          <Link to={`/pacientes/${id}/editar`}>
            <Button variant="outline">Editar Datos</Button>
          </Link>
          <Button variant="secondary" className="text-red-600 hover:bg-red-50" onClick={handleDeactivate}>
            Desactivar
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Info y Asignaciones (1 columna en md) */}
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">Información</h3>
            <ul className="space-y-3 text-stone-700">
              <li><strong>Nacimiento:</strong> {new Date(paciente.fecha_nacimiento).toLocaleDateString()}</li>
              <li><strong>Representante:</strong> {paciente.representante || 'N/A'}</li>
              <li><strong>Teléfono:</strong> {paciente.telefono || 'N/A'}</li>
              <li><strong>Correo:</strong> {paciente.correo || 'N/A'}</li>
              {paciente.observaciones && (
                <li className="pt-2 border-t mt-2"><strong>Obs:</strong> {paciente.observaciones}</li>
              )}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">Terapeutas Asignados</h3>
            {asignaciones.length === 0 ? (
              <p className="text-stone-500 italic mb-4">Ningún terapeuta asignado.</p>
            ) : (
              <ul className="space-y-3 mb-6">
                {asignaciones.map(a => (
                  <li key={a.id} className="flex justify-between items-center bg-stone-50 p-2 rounded">
                    <span>{a.perfiles.nombres} {a.perfiles.apellidos}</span>
                    <button onClick={() => handleRemoveAsignacion(a.id)} className="text-red-500 hover:text-red-700 font-bold px-2" title="Quitar">&times;</button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAddAsignacion} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-stone-700">Asignar nuevo terapeuta:</label>
              <select 
                className="w-full px-3 py-2 rounded border border-stone-300 bg-white"
                value={selectedTerapeuta}
                onChange={(e) => setSelectedTerapeuta(e.target.value)}
                disabled={assigning}
              >
                <option value="">Seleccione...</option>
                {terapeutas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombres} {t.apellidos} ({t.especialidad || 'General'})</option>
                ))}
              </select>
              <Button type="submit" disabled={!selectedTerapeuta} isLoading={assigning} className="py-2 text-base mt-2">
                Asignar
              </Button>
            </form>
          </Card>
        </div>

        {/* Documentos (2 columnas en md) */}
        <div className="md:col-span-2 space-y-8">
          <Card className="p-6 bg-teal-50 border-teal-100">
            <h3 className="text-xl font-bold text-teal-900 mb-4">Subir Documento PDF</h3>
            <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Archivo (solo PDF, max 5MB)</label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 bg-white rounded border border-teal-200"
                  disabled={uploading}
                />
              </div>
              <Input label="Título del documento" value={docTitulo} onChange={e => setDocTitulo(e.target.value)} required disabled={uploading} />
              <div className="flex flex-col gap-2">
                <label className="text-lg font-medium text-stone-700">Tipo de Documento</label>
                <select 
                  value={docTipo} 
                  onChange={e => setDocTipo(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border text-lg bg-stone-50 text-stone-900 border-stone-300"
                  disabled={uploading}
                >
                  <option value="consentimiento_informado">Consentimiento Informado</option>
                  <option value="plan_tratamiento">Plan de Tratamiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Input label="Descripción breve (opcional)" value={docDesc} onChange={e => setDocDesc(e.target.value)} disabled={uploading} />
              </div>
              <div className="md:col-span-2 pt-2">
                <Button type="submit" isLoading={uploading}>Subir Archivo</Button>
              </div>
            </form>
          </Card>

          <div>
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Archivos del Paciente</h3>
            {documentos.length === 0 ? (
              <Card className="p-8 text-center text-stone-500">
                Aún no hay documentos para este paciente.
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {documentos.map(doc => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
