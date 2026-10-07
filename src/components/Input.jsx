import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  const id = useId();
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-lg font-medium text-(--color-text-main)">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border-2 text-lg bg-(--color-surface) text-(--color-text-main) transition-all outline-none ${
          error 
            ? 'border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50' 
            : 'border-(--color-border) focus:border-(--color-primary-500) focus:ring-4 focus:ring-(--color-primary-100) hover:border-(--color-primary-300)'
        }`}
        {...props}
      />
      {error && (
        <span className="text-red-600 font-medium text-sm mt-1 animate-fade-up">{error}</span>
      )}
    </div>
  );
});
