export function Card({ children, className = '', onClick }) {
  return (
    <div 
      className={`relative bg-(--color-surface) rounded-xl shadow-sm border border-(--color-border) overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group ${className}`}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-(--color-primary-400) to-(--color-primary-600) opacity-0 group-hover:opacity-100 transition-opacity" />
      {children}
    </div>
  );
}
