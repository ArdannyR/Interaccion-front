import { Card } from '../../components/Card';

export function HorariosView() {
  const horas = [];
  for (let h = 8; h <= 18; h++) {
    horas.push(`${h.toString().padStart(2, '0')}:00`);
  }
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-(--color-text-main)">Horarios</h1>
      </div>
      
      <Card className="overflow-x-auto">
        <div className="min-w-[800px] p-6">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <div className="font-semibold text-(--color-text-muted) text-center">Hora</div>
            {dias.map(dia => (
              <div key={dia} className="font-semibold text-(--color-primary-700) text-center text-lg">{dia}</div>
            ))}
          </div>
          
          <div className="space-y-4">
            {horas.map(hora => (
              <div key={hora} className="grid grid-cols-6 gap-4">
                <div className="text-center font-medium text-(--color-text-muted) py-2">{hora}</div>
                {dias.map(dia => (
                  <div 
                    key={`${dia}-${hora}`} 
                    className="border-2 border-dashed border-(--color-border) rounded-lg p-2 text-center text-sm text-(--color-text-muted) bg-(--color-surface-hover) flex items-center justify-center min-h-[60px]"
                  >
                    {/* Futuro: Mostrar aquí tarjeta de asignación */}
                    Disponible
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
