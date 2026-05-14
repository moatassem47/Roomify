
const Input = ({ 
  label="", 
  name, 
  register=null, 
  error, 
  type = "text", 
  placeHolder, 
  children, 
  className = "",
  onChange 
}) => {
  
  
  const baseInputStyles = "bg-brand-cream rounded-base shadow-inset-soft h-12 pl-6 outline-0 placeholder:text-brand-surface-dim";
  
  
  const errorStyles = error ? "border border-brand-error" : "";

  return (
    <div className="flex flex-col gap-2 flex-1 relative">
      
      {label&&<label htmlFor={name} className="font-sans text-brand-cedar font-semibold text-sm">
        {label}
      </label> }

      
      <input 
        id={name} 
        type={type} 
        placeholder={placeHolder}
       {...(register ? register(name, {
            onChange: (e) => {
                if (onChange) onChange(e); 
            }
        }) : { onChange })}
        className={`${baseInputStyles} ${errorStyles} ${className}`} 
      /> 
            
      {children}      
            
      
      {error && <span className="text-brand-error text-sm">{error.message}</span>}
    </div>
  );
};

export default Input;