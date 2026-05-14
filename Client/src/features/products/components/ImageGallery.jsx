import {useState} from 'react'

const ImageGallery = ({images}) => {

  const [activeImage,setActiveImage]=useState(images[0])

  if(!images || images.length===0)return null;
  

  return (
    <div className="flex flex-col gap-4">
        <div className="w-full overflow-hidden rounded-2xl bg-brand-surface-container/30">
            <img src={activeImage} alt='Product feature' key={activeImage}
            className="w-full h-auto object-contain animate-fade-in"
            />
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