import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { documentosService } from './documentsService';

export function DocumentCard({ document }) {
  const [loading, setLoading] = useState(false);

  const handleOpenDocument = async (action) => {
    setLoading(true);
    try {
      const url = await documentosService.getDocumentUrl(document.ruta_archivo);
      
      if (action === 'download') {
        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${document.titulo}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // View in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      alert("Hubo un problema al intentar abrir el documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 flex flex-col h-full border-stone-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-stone-900 mb-2">{document.titulo}</h3>
        {document.descripcion && (
          <p className="text-lg text-stone-600 mb-4">{document.descripcion}</p>
        )}
      </div>
      
      <div className="flex gap-3 mt-6 pt-4 border-t border-stone-100">
        <Button 
          variant="primary" 
          className="flex-1"
          onClick={() => handleOpenDocument('view')}
          disabled={loading}
        >
          Ver
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => handleOpenDocument('download')}
          disabled={loading}
        >
          Descargar
        </Button>
      </div>
    </Card>
  );
}
