import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Spinner } from '../../components/Spinner';
import { DateInput } from '../../components/DateInput';

// Utility para calcular edad en años y meses
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

// Función para obtener la fecha local actual en formato YYYY-MM-DD
function getLocalToday() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function PlanForm() {
  const { id, planId } = useParams();
  const navigate = useNavigate();
  const { perfil } = useAuth();
  const isEditing = Boolean(planId);

  const [paciente, setPaciente] = useState(null);
  
  const [formData, setFormData] = useState({
    diagnostico: '',
    fecha: getLocalToday(),
    objetivo_inicial: '',
    objetivos_alcanzados: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const pac = await pacientesService.getPaciente(id);
        setPaciente(pac);

        if (isEditing) {
          const planData = await pacientesService.getPlan(planId);
          setFormData({
            diagnostico: planData.diagnostico || '',
            fecha: planData.fecha || getLocalToday(),
            objetivo_inicial: planData.objetivo_inicial || '',
            objetivos_alcanzados: planData.objetivos_alcanzados || '',
          });
        }
      } catch {
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, planId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await pacientesService.updatePlan(planId, formData);
      } else {
        await pacientesService.createPlan({
          ...formData,
          paciente_id: id,
          creado_por: perfil?.id || 'sistema',
        });
      }
      navigate('/pacientes');
    } catch {
      setError('Error al guardar el plan de tratamiento');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">
          {isEditing ? 'Editar Plan de Tratamiento' : 'Nuevo Plan de Tratamiento'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/pacientes')}>
          Cancelar
        </Button>
      </div>

      {paciente && (
        <div className="bg-(--color-primary-50) border border-(--color-primary-200) rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-(--color-primary-700) font-semibold uppercase tracking-wider">Paciente</p>
            <p className="text-xl font-bold text-(--color-text-main)">{paciente.nombre_completo}</p>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-(--color-primary-700) font-semibold uppercase tracking-wider">Edad</p>
            <p className="text-xl font-bold text-(--color-text-main)">{calcularEdad(paciente.fecha_nacimiento)}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-(--color-surface) p-6 md:p-8 rounded-xl shadow-sm border border-(--color-border) space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Diagnóstico *"
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            required
            className="text-lg md:col-span-2"
          />
          <DateInput
            label="Fecha *"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-(--color-text-main)">Objetivo inicial de tratamiento *</label>
          <textarea
            name="objetivo_inicial"
            value={formData.objetivo_inicial}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-(--color-border) rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) bg-(--color-surface) text-lg resize-y"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-(--color-text-main)">Objetivos reales alcanzados</label>
          <p className="text-sm text-(--color-text-muted) mb-2">Se completa más adelante</p>
          <textarea
            name="objetivos_alcanzados"
            value={formData.objetivos_alcanzados}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-(--color-border) rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) bg-(--color-surface) text-lg resize-y"
          ></textarea>
        </div>

        <div className="pt-6">
          <Button type="submit" disabled={saving} className="w-full text-xl py-4">
            {saving ? <Spinner size="sm" color="text-white" /> : 'Guardar Plan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
