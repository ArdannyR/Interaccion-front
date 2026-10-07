export function DateInput({ label, helperText, className = '', ...props }) {
  // Obtenemos la fecha de hoy para setear como max por defecto si no viene
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-lg font-medium text-(--color-text-main)">{label}</label>}
      <input
        type="date"
        max={today}
        className="px-4 py-3 border border-(--color-border) rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) bg-(--color-surface) text-lg"
        {...props}
      />
      {helperText && <p className="text-sm text-(--color-text-muted)">{helperText}</p>}
    </div>
  );
}
