import Button from "./Button"

function Hero({ background, backgroundStyle, title, titleStyle, text, textStyle, button = null,onClick }) {
  return (
    <section 
      className={`${backgroundStyle} relative overflow-hidden`}
      style={{ 
        
        backgroundImage: `
          linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%), 
          url(${background})
        `, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      
        <div className="relative z-10 w-full h-full flex flex-col md:items-start items-center md:px-30  px-10 justify-center gap-7 bg-white/10 ">
          <h1 className={`${titleStyle} md:text-3xl font-sans text-brand-cedar font-semibold sm:text-xl text-lg text-center `}>{title}</h1>
          <p className={`${textStyle} md:text-base md:text-start text-sm text-center`}>{text}</p>
          {button && <Button className="px-8 py-3 rounded-base shadow-ambient hover:-translate-y-1 transition-all" onClick={onClick}>{button}</Button>} 
        </div>
    </section>
  )
}

export default Hero