export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  type = 'button'
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};