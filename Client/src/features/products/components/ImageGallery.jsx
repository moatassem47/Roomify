import {useState} from 'react'
import {Box} from "lucide-react"
import Viewin3D from './Viewin3D';
const ImageGallery = ({images,model}) => {

  const [activeImage,setActiveImage]=useState(images[0])
  const [show3D, setShow3D] = useState(false);

  if(!images || images.length===0)return null;
  

  return (
    <div className="flex flex-col gap-4">
        <div className="w-full h-100 overflow-hidden rounded-2xl  relative flex items-center justify-center">
            {show3D && model ? (
                <Viewin3D model={model} />
            ) : (
                <img src={activeImage} alt='Product feature' key={activeImage}
                className="w-full h-full object-contain object-center animate-fade-in p-4"
                />
            )}
            
            {model && (
                <button
                  onClick={() => setShow3D(!show3D)}
                  className={`absolute top-3 right-4 p-2.5 shadow-ambient rounded-full cursor-pointer transition-all duration-300 z-10 ${
                    show3D 
                      ? 'bg-brand-cedar text-white hover:bg-brand-cedar-hover' 
                      : 'bg-white text-brand-charcoal hover:bg-brand-surface-container'
                  }`}
                  title={show3D ? "View Gallery" : "View in 3D"}
                >
                    <Box size={20} />
                </button>
            )}
        </div>
        <div className='flex gap-4 overflow-x-auto pb-2'>
            {images.map((image,i)=>(
            <div onClick={()=>setActiveImage(image)} key={i} 
            className={`
              shrink-0 w-20 h-20 overflow-hidden rounded-xl bg-brand-surface-container transition-all duration-300
              ${activeImage === image 
                ? 'ring-2 ring-brand-cedar ring-offset-2 opacity-100' 
                : 'opacity-60 hover:opacity-100'}
            `}
            >
             <img src={image} alt={`Thumbnail ${i+1}`}
             className="w-full h-full object-cover"
             />
            </div>
            ))}
        </div>
    </div>
  )
}

export default ImageGallery