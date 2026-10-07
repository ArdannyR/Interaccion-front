import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';

export function PacienteCard({ paciente }) {
  const navigate = useNavigate();
  const plan = paciente.latestPlan;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow bg-(--color-surface) border border-(--color-border)">
      {/* Top area with avatar and name */}
      <div className="flex flex-col items-center p-6 bg-(--color-primary-50) border-b border-(--color-border)">
        <div className="w-20 h-20 bg-(--color-surface) rounded-full flex items-center justify-center text-(--color-primary-400) mb-4 shadow-sm">
          {/* SVG Avatar Genérico Infantil */}
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center text-(--color-text-main) line-clamp-2">
          {paciente.nombre_completo}
        </h3>
      </div>

      {/* Bottom areas */}
      <div className="flex divide-x divide-(--color-border) flex-1">
        <button 
          onClick={() => navigate(`/pacientes/${paciente.id}`)}
          className="flex-1 p-4 text-center hover:bg-(--color-surface-hover) transition-colors flex flex-col justify-center"
        >
          <span className="text-sm font-semibold uppercase text-(--color-primary-700) tracking-wider block mb-1">
            Datos
          </span>
          <span className="text-sm text-(--color-text-muted)">Ver perfil</span>
        </button>
        
        <button 
          onClick={() => {
            if (plan) {
              navigate(`/pacientes/${paciente.id}/plan/${plan.id}/editar`);
            } else {
              navigate(`/pacientes/${paciente.id}/plan/nuevo`);
            }
          }}
          className="flex-1 p-4 text-center hover:bg-(--color-surface-hover) transition-colors flex flex-col justify-center"
        >
          <span className="text-sm font-semibold uppercase text-(--color-primary-700) tracking-wider block mb-1">
            Diagnóstico
          </span>
          <span className="text-sm text-(--color-text-muted) line-clamp-2">
            {plan ? plan.diagnostico : "Sin plan"}
          </span>
        </button>
      </div>
    </Card>
  );
}
