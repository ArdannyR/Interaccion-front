export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg text-lg px-6 py-3 transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-teal-700 hover:bg-teal-800 text-white focus:ring-teal-300",
    secondary: "bg-stone-200 hover:bg-stone-300 text-stone-900 focus:ring-stone-100",
    outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50 focus:ring-teal-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </button>
  );
}
