export function Card({ children, className = '' }) {
  return (
    <div className={`bg-(--color-surface) rounded-xl shadow-sm border border-(--color-border) overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
