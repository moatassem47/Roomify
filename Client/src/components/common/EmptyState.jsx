import { useNavigate } from "react-router-dom"
import Button from "./Button"


const EmptyState = ({image,alt,title,text,button}) => {
    const navigate=useNavigate()
  return (
    <div className="flex flex-col items-center gap-10 pt-5 pb-15 justify-center">
        <figure>
            <img src={image} alt={alt} className="size-100 "/>
        </figure>
        <h1 className="text-5xl font-semibold text-center">{title}</h1>
        <p className="w-100 text-center tracking-wider text-brand-cedar">{text}</p>
        {button&&<Button onClick={()=>navigate("/")}>{button}</Button>}
    </div>
  )
}

export default EmptyState