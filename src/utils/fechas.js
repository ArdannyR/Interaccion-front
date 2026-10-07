export const DURACION_CITA_MIN = 60;

// Obtener fecha local en formato YYYY-MM-DD
export function getLocalTodayDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Obtener fecha a partir de una fecha local + n días
export function addDaysLocal(dateString, days) {
  const d = new Date(dateString + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Obtener el lunes de la semana de una fecha
export function getStartOfWeekLocal(dateString) {
  const d = new Date(dateString + 'T00:00:00');
  const day = d.getDay(); // 0 is Sunday, 1 is Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dDay = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dDay}`;
}

// Formatear hora de HH:MM:SS a HH:MM
export function formatTime(timeString) {
  if (!timeString) return '';
  return timeString.substring(0, 5);
}

// Obtener lista de horas permitidas
export function getHorasPermitidas() {
  const horas = [];
  for (let h = 8; h <= 17; h++) {
    horas.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return horas;
}

// Sumar minutos a una hora HH:MM
export function addMinutesToTime(timeStr, minutes) {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10) + minutes;
  h += Math.floor(m / 60);
  m = m % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Saber si una fecha es anterior a hoy
export function isPastDateLocal(dateString) {
  return dateString < getLocalTodayDate();
}
