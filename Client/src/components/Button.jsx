
const Button = ({className="",children,type="button",onClick, disabled = false}) => {

const DefaultButtonStyle=" bg-brand-cedar text-white font-sans font-semibold cursor-pointer rounded-large py-3 px-6 shadow-ambient hover:-translate-y-1 hover:shadow-ambient-hover transition-all duration-300 active:opacity-80"
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={`${DefaultButtonStyle} disabled:hover:translate-y-0 disabled:hover:shadow-ambient ${className}`}>{children}</button>
  )
}

export default Button
