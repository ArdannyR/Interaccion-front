import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentosService } from './documentsService';
import { Spinner } from '../../components/Spinner';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export function DocumentosList() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await documentosService.getAllDocuments();
        setDocumentos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  const handleOpenDocument = async (docPath, action) => {
    try {
      const url = await documentosService.getDocumentUrl(docPath);
      if (action === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = true; // El navegador intentará descargarlo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error(error);
      alert('Error al abrir el documento.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-stone-900">Todos los Documentos</h2>
        <Link to="/dashboard" className="text-teal-700 hover:underline mt-2 inline-block">&larr; Volver al panel</Link>
      </div>

      {loading ? (
        <Spinner />
      ) : documentos.length === 0 ? (
        <Card className="p-12 text-center text-lg text-stone-600">
          No hay documentos registrados en el sistema.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((doc) => (
            <Card key={doc.id} className="p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-stone-900 mb-1">{doc.titulo}</h3>
                <p className="text-sm font-semibold text-teal-700 mb-2">
                  Paciente: {doc.pacientes?.nombres} {doc.pacientes?.apellidos}
                </p>
                {doc.descripcion && (
                  <p className="text-stone-600 mb-4">{doc.descripcion}</p>
                )}
                <span className="inline-block bg-stone-100 text-stone-600 text-sm px-2 py-1 rounded">
                  {doc.tipo.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex gap-2 mt-6 pt-4 border-t border-stone-100">
                <Button variant="outline" className="flex-1 py-2" onClick={() => handleOpenDocument(doc.ruta_archivo, 'view')}>Ver</Button>
                <Button variant="secondary" className="flex-1 py-2" onClick={() => handleOpenDocument(doc.ruta_archivo, 'download')}>Descargar</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
