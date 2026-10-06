import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  const id = useId();
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-lg font-medium text-stone-700">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 rounded-lg border text-lg bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-stone-300 focus:ring-teal-200 focus:border-teal-500'
        }`}
        {...props}
      />
      {error && (
        <span className="text-red-600 font-medium text-sm mt-1">{error}</span>
      )}
    </div>
  );
});
