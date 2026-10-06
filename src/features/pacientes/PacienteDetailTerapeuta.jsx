import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { documentosService } from '../documents/documentsService';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';
import { DocumentCard } from '../documents/DocumentCard';

export function PacienteDetailTerapeuta() {
  const { id } = useParams();
  
  const [paciente, setPaciente] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [pacData, docData] = await Promise.all([
          pacientesService.getPaciente(id),
          documentosService.getDocumentsByPaciente(id)
        ]);
        setPaciente(pacData);
        setDocumentos(docData);
      } catch (err) {
        console.error("Error al cargar información del paciente");
        setError('No tienes acceso a este paciente o no existe.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-10"><Spinner /></div>;
  if (error || !paciente) return <div className="p-10 text-center text-xl text-red-600">{error || 'Paciente no encontrado.'}</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-stone-900">{paciente.nombres} {paciente.apellidos}</h2>
        <Link to="/mis-pacientes" className="text-teal-700 hover:underline mt-2 inline-block">&larr; Volver a Mis Pacientes</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-stone-800 mb-4 border-b pb-2">Información del Paciente</h3>
            <ul className="space-y-3 text-stone-700">
              <li><strong>Nacimiento:</strong> {new Date(paciente.fecha_nacimiento).toLocaleDateString()}</li>
              <li><strong>Representante:</strong> {paciente.representante || 'N/A'}</li>
              <li><strong>Teléfono:</strong> {paciente.telefono || 'N/A'}</li>
              <li><strong>Correo:</strong> {paciente.correo || 'N/A'}</li>
              {paciente.observaciones && (
                <li className="pt-2 border-t mt-2"><strong>Observaciones:</strong> {paciente.observaciones}</li>
              )}
            </ul>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">Expediente (Documentos)</h3>
          {documentos.length === 0 ? (
            <Card className="p-8 text-center text-stone-500">
              No hay documentos disponibles para este paciente.
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
  );
}
