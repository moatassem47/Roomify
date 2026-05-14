import Hero from "../components/common/Hero"
import LandingPage from "../assets/images/LandingPage.webp"
import NewArrival from "../features/products/components/NewArrival"
import Button from "../components/common/Button"
import {useNavigate} from "react-router-dom"
import OurPhilosophy from "../features/products/components/OurPhilosophy"

const Home = () => {

  const navigate=useNavigate()
  
  return (
    <>
      <Hero background={LandingPage} backgroundStyle="h-screen" title="Create a Sanctuary of Comfort & Joy"
      text="Thoughtfully designed furniture that turns every corner of your home into a restorative escape. Sustainable materials, timeless design, and a touch of warmth for your modern hearth."
      button="Shop the Collection"
      textStyle={"md:w-140 w-90 text-gray-700 tracking-wider "}
      onClick={()=>navigate("/shop")}
      />

      <section className=" md:px-30 md:py-20 p-10 flex flex-col gap-10 ">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-3">
                <h2 className="text-brand-cedar tracking-widest font-sans md:text-base text-sm">Curated Selection</h2>
                <span className="font-serif md:text-base text-sm">The New Arrivals</span>
              </div>
              <Button className="text-[#84746c]! bg-inherit! shadow-none hover:shadow-none font-normal! md:text-base text-sm" onClick={()=>navigate("shop")} >{"Explore All >"}</Button>
            </div>
              <NewArrival/>
      </section>
      <OurPhilosophy/>
    </>
  )
}

export default Home