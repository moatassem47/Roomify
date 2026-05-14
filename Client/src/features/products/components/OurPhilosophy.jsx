import Chair from "../../../assets/images/chair.jpg"
import Button from '../../../components/common/Button'
import { Flower,Heart ,Leaf} from 'lucide-react';
import {useNavigate} from "react-router-dom"

const OurPhilosophy = () => {
    const navigate=useNavigate()
  return (
    <section className="flex  gap-20 items-center justify-center  p-30 bg-brand-surface-container flex-wrap">
        <figure className="flex-1 relative">
            <img src={Chair} alt="chair photo" className=" min-w-50  object-cover object-bottom md:size-200 sm:size-120  size-90 rounded-2xl "/>
            <div className="bg-white px-12 py-7 hidden md:flex flex-col gap-5 absolute rounded-2xl shadow-lg -right-8 -bottom-8 ">
                <div className="flex items-center gap-3 ">
                    <div className="w-13 h-13 rounded-full bg-green-200 flex justify-center items-center">
                    <Leaf  className="bg-green text-green-700 "/>
                    </div>
                    <span>Eco-Conscious Craft</span>
                </div>
                <p className="text-sm w-60 tracking-wide text-gray-700">We source only sustainable hardwoods and recycled textiles to ensure your comfort doesn't cost the Earth.</p>
            </div>
        </figure>
        <div className="flex flex-col gap-9 flex-1 shrink-0">
            <h2 className="text-brand-cedar md:text-start text-center tracking-widest font-sans">OUR PHILOSOPHY</h2>
            <span className="font-serif md:text-start text-center">
                Design That Feels Like a Deep Exhale.
            </span>
            <p className="md:w-140 w-90 text-gray-700 tracking-wider md:text-base md:text-start text-sm text-center">At Modern Hearth, we believe your home should be more than just a place where you keep your things. It should be a restorative sanctuary—a tactile experience of comfort and joy.</p>
            <div className="flex  items-center gap-4">
                <Flower color="#825032" />
                <div>
                    <span>Restorative Spaces</span>
                    <p className="text-gray-700 tracking-wider md:text-base md:text-start text-sm text-center">Every piece is designed to lower your heart rate and soothe the senses</p>
                </div>
            </div>
            <div className="flex  items-center gap-4">
                <Heart color="#825032" fill="#825032"/>
                <div>
                    <span>Built for Joy</span>
                    <p className="text-gray-700 tracking-wider md:text-base md:text-start text-sm text-center">We focus on the small details that bring a smile to your face every morning.</p>
                </div>
            </div>
            <Button className="text-brand-cedar! underline underline-offset-8 md:text-start text-center bg-inherit! shadow-none hover:shadow-none font-normal!" onClick={()=>navigate("/")}>Read Our Full Story</Button>
        </div>
    </section>
  )
}

export default OurPhilosophy