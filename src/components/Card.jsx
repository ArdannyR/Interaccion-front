export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
