import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { citasService } from '../citas/citasService';
import { getStartOfWeekLocal, addDaysLocal, getLocalTodayDate } from '../../utils/fechas';
import { WeeklyCalendar } from '../citas/WeeklyCalendar';
import { CitaFormModal } from '../citas/CitaFormModal';
import { CitaDetalleModal } from '../citas/CitaDetalleModal';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

export function HorariosView() {
  const { perfil } = useAuth();
  
  const [citas, setCitas] = useState([]);
  const [semanaInicio, setSemanaInicio] = useState(getStartOfWeekLocal(getLocalTodayDate()));
  const [loading, setLoading] = useState(true);
  
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [formInitialData, setFormInitialData] = useState({});

  const fetchCitas = async () => {
    if (!perfil?.id) return;
    setLoading(true);
    try {
      const hasta = addDaysLocal(semanaInicio, 4); // Viernes
      const data = await citasService.getCitas({
        desde: semanaInicio,
        hasta: hasta,
        profesionalId: perfil.id
      });
      setCitas(data);
    } catch (err) {
      console.error('Error cargando citas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCitas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil?.id, semanaInicio]);

  const handleCambiarSemana = (dias) => {
    if (dias === 0) {
      setSemanaInicio(getStartOfWeekLocal(getLocalTodayDate()));
    } else {
      setSemanaInicio(prev => addDaysLocal(prev, dias));
    }
  };

  const handleClickCasillaVacia = (fecha, hora) => {
    setFormInitialData({ fecha, hora_inicio: hora, profesional_id: perfil.id });
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

  const handleCancelCita = async (id) => {
    await citasService.cancelCita(id);
    setModalDetalleOpen(false);
    fetchCitas();
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">Mi Horario</h1>
        <Button 
          onClick={() => {
            setFormInitialData({ profesional_id: perfil.id });
            setModalFormOpen(true);
          }} 
          className="text-lg py-3 px-6"
        >
          + Nueva cita
        </Button>
      </div>
      
      {loading && citas.length === 0 ? (
        <div className="flex justify-center p-12"><Spinner /></div>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
              <Spinner />
            </div>
          )}
          <WeeklyCalendar 
            citas={citas}
            semanaInicio={semanaInicio}
            onCambiarSemana={handleCambiarSemana}
            onClickCasillaVacia={handleClickCasillaVacia}
            onClickCita={handleClickCita}
            modo="profesional"
          />
        </div>
      )}

      {modalFormOpen && (
        <CitaFormModal 
          onClose={() => setModalFormOpen(false)}
          onSuccess={handleSuccessForm}
          initialData={formInitialData}
          lockProfesional={true}
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
