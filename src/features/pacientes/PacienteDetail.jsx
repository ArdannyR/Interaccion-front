import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { citasService } from '../citas/citasService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import { WeeklyCalendar } from '../citas/WeeklyCalendar';
import { ProximasCitas } from '../citas/ProximasCitas';
import { CitaFormModal } from '../citas/CitaFormModal';
import { CitaDetalleModal } from '../citas/CitaDetalleModal';
import { getStartOfWeekLocal, addDaysLocal, getLocalTodayDate } from '../../utils/fechas';

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

  // Citas state
  const [citasSemana, setCitasSemana] = useState([]);
  const [proximasCitas, setProximasCitas] = useState([]);
  const [semanaInicio, setSemanaInicio] = useState(getStartOfWeekLocal(getLocalTodayDate()));
  const [loadingCitas, setLoadingCitas] = useState(true);

  // Modals state
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [formInitialData, setFormInitialData] = useState({});

  const fetchCitas = async () => {
    setLoadingCitas(true);
    try {
      const hasta = addDaysLocal(semanaInicio, 4); // Viernes
      const [dataSemana, dataProximas] = await Promise.all([
        citasService.getCitas({ desde: semanaInicio, hasta: hasta, pacienteId: id }),
        citasService.getCitas({ desde: getLocalTodayDate(), pacienteId: id })
      ]);
      setCitasSemana(dataSemana);
      setProximasCitas(dataProximas);
    } catch (err) {
      console.error('Error cargando citas', err);
    } finally {
      setLoadingCitas(false);
    }
  };

  useEffect(() => {
    pacientesService.getPaciente(id)
      .then(setPaciente)
      .catch(() => setError('Error al cargar la información del paciente'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCitas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, semanaInicio]);

  const handleCambiarSemana = (dias) => {
    if (dias === 0) {
      setSemanaInicio(getStartOfWeekLocal(getLocalTodayDate()));
    } else {
      setSemanaInicio(prev => addDaysLocal(prev, dias));
    }
  };

  const handleClickCasillaVacia = (fecha, hora) => {
    setFormInitialData({ fecha, hora_inicio: hora, paciente_id: id });
    setModalFormOpen(true);
  };

  const handleClickCita = (cita) => {
    setCitaSeleccionada(cita);
    setModalDetalleOpen(true);
  };

  const handleSuccessForm = () => {
    setModalFormOpen(false);
    fetchCitas();
  };

  const handleCancelCita = async (citaId) => {
    await citasService.cancelCita(citaId);
    setModalDetalleOpen(false);
    fetchCitas();
  };

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
          <Link to="/pacientes" className="text-(--color-primary-600) hover:underline mt-2 inline-block font-medium">
            &larr; Volver a pacientes
          </Link>
        </div>
        <Button onClick={() => navigate(`/pacientes/${id}/editar`)} className="text-lg py-2">
          Editar Datos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Datos Personales e Historial de Planes */}
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

          {/* Widget de Próximas Citas */}
          <ProximasCitas 
            citas={proximasCitas} 
            modo="paciente"
            onClickCita={handleClickCita}
          />

        </div>

        {/* Tab content principal (Citas y Planes) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Citas Calendario */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-(--color-primary-700)">Calendario de Citas</h2>
              <Button onClick={() => {
                setFormInitialData({ paciente_id: id });
                setModalFormOpen(true);
              }}>
                + Agendar cita
              </Button>
            </div>

            <div className="relative">
              {loadingCitas && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                  <Spinner />
                </div>
              )}
              <WeeklyCalendar 
                citas={citasSemana}
                semanaInicio={semanaInicio}
                onCambiarSemana={handleCambiarSemana}
                onClickCasillaVacia={handleClickCasillaVacia}
                onClickCita={handleClickCita}
                modo="paciente"
              />
            </div>
          </section>

          <hr className="border-(--color-border)" />

          {/* Planes de Tratamiento */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-(--color-primary-700)">Planes de Tratamiento</h2>
              <Button variant="outline" onClick={() => navigate(`/pacientes/${id}/plan/nuevo`)}>
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
          </section>

        </div>

      </div>

      {modalFormOpen && (
        <CitaFormModal 
          onClose={() => setModalFormOpen(false)}
          onSuccess={handleSuccessForm}
          initialData={formInitialData}
          lockPaciente={true}
        />
      )}

      {modalDetalleOpen && citaSeleccionada && (
        <CitaDetalleModal 
          cita={citaSeleccionada}
          onClose={() => setModalDetalleOpen(false)}
          onEdit={(c) => {
            setFormInitialData(c);
            setModalDetalleOpen(false);
            setModalFormOpen(true);
          }}
          onCancelCita={handleCancelCita}
        />
      )}

    </div>
  );
}
