import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

// Utility function duplicated here for simplicity, normally it would go to a shared utils file.
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return '';
  const nac = new Date(fechaNacimiento + 'T00:00:00');
  const hoy = new Date();
  let anios = hoy.getFullYear() - nac.getFullYear();
  let meses = hoy.getMonth() - nac.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < nac.getDate())) {
    anios--;
    meses += 12;
  }
  if (hoy.getDate() < nac.getDate()) {
    meses--;
    if (meses < 0) {
      meses = 11;
    }
  }
  if (anios === 0) return `${meses} meses`;
  if (meses === 0) return `${anios} años`;
  return `${anios} años y ${meses} meses`;
}

export function PacienteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    pacientesService.getPaciente(id)
      .then(setPaciente)
      .catch(() => setError('Error al cargar la información del paciente'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;
  if (error) return <div className="text-red-600 text-center p-12 text-lg">{error}</div>;
  if (!paciente) return <div className="text-center p-12 text-lg">Paciente no encontrado</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">
            {paciente.nombre_completo}
          </h1>
          <Link to="/pacientes" className="text-(--color-primary-600) hover:underline mt-2 inline-block">
            &larr; Volver a pacientes
          </Link>
        </div>
        <Button onClick={() => navigate(`/pacientes/${id}/editar`)} className="text-lg py-2">
          Editar Datos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Datos Personales */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-(--color-surface) p-6 rounded-xl border border-(--color-border) shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold text-(--color-primary-700) border-b border-(--color-border) pb-2">Información</h2>
            
            <div>
              <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Cédula</p>
              <p className="text-lg text-(--color-text-main)">{paciente.cedula}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Edad</p>
              <p className="text-lg text-(--color-text-main)">{calcularEdad(paciente.fecha_nacimiento)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Dirección</p>
              <p className="text-lg text-(--color-text-main)">{paciente.direccion}</p>
            </div>
          </div>

          <div className="bg-(--color-surface) p-6 rounded-xl border border-(--color-border) shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold text-(--color-primary-700) border-b border-(--color-border) pb-2">Familiares</h2>
            
            <div>
              <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Madre</p>
              <p className="text-lg text-(--color-text-main)">{paciente.madre_nombre}</p>
              <p className="text-(--color-text-muted)">{paciente.madre_telefono}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Padre</p>
              <p className="text-lg text-(--color-text-main)">{paciente.padre_nombre}</p>
              <p className="text-(--color-text-muted)">{paciente.padre_telefono}</p>
            </div>
            
            {paciente.contacto_nombre && (
              <div className="pt-2 border-t border-(--color-border)">
                <p className="text-sm font-semibold uppercase text-(--color-text-muted) tracking-wider">Emergencia</p>
                <p className="text-lg text-(--color-text-main)">{paciente.contacto_nombre}</p>
                <p className="text-(--color-text-muted)">{paciente.contacto_telefono}</p>
              </div>
            )}
          </div>
        </div>

        {/* Planes de Tratamiento */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-(--color-primary-700)">Planes de Tratamiento</h2>
            <Button onClick={() => navigate(`/pacientes/${id}/plan/nuevo`)}>
              + Nuevo Plan
            </Button>
          </div>

          {(!paciente.planes_tratamiento || paciente.planes_tratamiento.length === 0) ? (
            <div className="bg-(--color-surface) p-12 rounded-xl border border-(--color-border) text-center text-lg text-(--color-text-muted)">
              No hay planes de tratamiento registrados.
            </div>
          ) : (
            <div className="space-y-4">
              {paciente.planes_tratamiento.map((plan) => (
                <div key={plan.id} className="bg-(--color-surface) p-6 rounded-xl border border-(--color-border) shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-(--color-border) pb-4">
                    <div>
                      <p className="text-sm font-semibold text-(--color-text-muted)">{new Date(plan.fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                      <h3 className="text-xl font-bold text-(--color-text-main) mt-1">{plan.diagnostico}</h3>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/pacientes/${id}/plan/${plan.id}/editar`)}>
                      Editar
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold uppercase text-(--color-primary-700) tracking-wider mb-1">Objetivo Inicial</p>
                    <p className="text-(--color-text-main) whitespace-pre-wrap">{plan.objetivo_inicial}</p>
                  </div>
                  
                  {plan.objetivos_alcanzados && (
                    <div>
                      <p className="text-sm font-semibold uppercase text-green-700 tracking-wider mb-1">Objetivos Alcanzados</p>
                      <p className="text-(--color-text-main) whitespace-pre-wrap">{plan.objetivos_alcanzados}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
