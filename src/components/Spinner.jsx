export function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin"></div>
    </div>
  );
}
