export function Spinner({ className = "w-8 h-8" }) {
  return (
    <div 
      className={`${className} border-4 border-(--color-primary-100) border-t-(--color-primary-600) rounded-full animate-spin`}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
