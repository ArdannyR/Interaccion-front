import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { pacientesService } from './pacientesService';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Spinner } from '../../components/Spinner';

// Función para validar la cédula ecuatoriana con algoritmo de módulo 10
function validarCedulaEcuatoriana(cedula) {
  if (!cedula || cedula.length !== 10 || !/^\d+$/.test(cedula)) {
    return false;
  }

  const digito_region = parseInt(cedula.substring(0, 2), 10);
  if ((digito_region < 1 || digito_region > 24) && digito_region !== 30) {
    return false;
  }

  const tercer_digito = parseInt(cedula.substring(2, 3), 10);
  if (tercer_digito > 5) {
    return false;
  }

  const digitos = cedula.split('').map(Number);
  const verificador = digitos.pop(); // Último dígito

  const suma = digitos.reduce((acc, curr, i) => {
    let valor = curr * (i % 2 === 0 ? 2 : 1);
    if (valor > 9) valor -= 9;
    return acc + valor;
  }, 0);

  let digito_calculado = 10 - (suma % 10);
  if (digito_calculado === 10) digito_calculado = 0;

  return digito_calculado === verificador;
}

export function PacienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    id: '', // La cédula será el ID
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    representante: '',
    telefono: '',
    correo: '',
    observaciones: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      pacientesService.getPaciente(id)
        .then(data => {
          setFormData({
            id: data.id || '',
            nombres: data.nombres || '',
            apellidos: data.apellidos || '',
            fecha_nacimiento: data.fecha_nacimiento || '',
            representante: data.representante || '',
            telefono: data.telefono || '',
            correo: data.correo || '',
            observaciones: data.observaciones || ''
          });
          setLoading(false);
        })
        .catch(() => {
          setError('No se pudo cargar la información del paciente.');
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!isEditing && !validarCedulaEcuatoriana(formData.id)) {
      setError('La cédula ingresada no es válida. Debe tener 10 números y ser una cédula real.');
      setSaving(false);
      return;
    }

    try {
      if (isEditing) {
        // En edición, no enviamos el ID porque es llave primaria y no se cambia
        const { id: _, ...datosAActualizar } = formData;
        await pacientesService.updatePaciente(id, datosAActualizar);
        navigate(`/pacientes/${id}`);
      } else {
        const nuevo = await pacientesService.createPaciente(formData);
        navigate(`/pacientes/${nuevo.id}`);
      }
    } catch (err) {
      // Manejar error de cédula duplicada
      if (err.code === '23505') {
        setError('Ya existe un paciente registrado con esta cédula.');
      } else {
        setError('Ocurrió un error al guardar los datos del paciente.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10"><Spinner /></div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-stone-900">
          {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h2>
        <Link to={isEditing ? `/pacientes/${id}` : "/pacientes"} className="text-teal-700 hover:underline mt-2 inline-block">
          &larr; Volver
        </Link>
      </div>

      <Card className="p-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input 
              label="Cédula de Identidad" 
              name="id" 
              value={formData.id} 
              onChange={handleChange} 
              required 
              disabled={isEditing || saving} 
              placeholder="Ej: 1710034065"
              maxLength={10}
            />
            <div className="hidden md:block"></div> {/* Espacio vacío para alinear */}
            
            <Input label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange} required disabled={saving} />
            <Input label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required disabled={saving} />
            <Input label="Fecha de Nacimiento" type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required disabled={saving} />
            <Input label="Representante (Tutor)" name="representante" value={formData.representante} onChange={handleChange} disabled={saving} />
            <Input label="Teléfono" type="tel" name="telefono" value={formData.telefono} onChange={handleChange} disabled={saving} />
            <Input label="Correo" type="email" name="correo" value={formData.correo} onChange={handleChange} disabled={saving} />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium text-stone-700">Observaciones</label>
            <textarea 
              name="observaciones" 
              value={formData.observaciones} 
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border text-lg bg-stone-50 text-stone-900 border-stone-300 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 min-h-[100px]"
              disabled={saving}
            ></textarea>
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={saving} className="w-full md:w-auto">Guardar Paciente</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
