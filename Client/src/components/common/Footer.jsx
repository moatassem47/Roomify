import myIcon from "../../assets/icons/roomify-logo.svg";

const Footer = () => {
  return (
    <footer className="bg-stone-100 py-10 px-12 flex flex-col gap-17 shadow-ambient">
      <div className="flex md:flex-row flex-col gap-10 items-center">
      <div className="flex flex-col gap-3 flex-1 ">
        <figure className="lg:w-60 w-30">
                <img src={myIcon} alt="logo"/>
        </figure>
        <p className="w-70 text-brand-cedar-hover tracking-wider text-base/6">Crafting spaces that reflect your unique journey through quality furniture and thoughtful design.</p>
      </div>
      <div className="flex flex-1 gap-2">
      <div className="flex flex-col gap-5 flex-1 ">
        <span >Support</span>
        <ul className="flex flex-col gap-3 [&>li:hover]:text-brand-cedar text-brand-cedar-hover tracking-wider ">
          <li>Contact Us</li>
          <li>Shipping Policy</li>
          <li>Returns</li>
        </ul>
      </div>
      <div className="flex flex-col gap-5 flex-1 ">
         <span>Legal</span>
        <ul  className="flex flex-col gap-3 [&>li:hover]:text-brand-cedar text-brand-cedar-hover tracking-wider" >
          <li>Privacy Policy</li>
          <li>Terms of Service</li>
          <li>Cookie Policy</li>
        </ul>
      </div>
      </div>
      
      </div>
      <p className="text-center text-sm text-brand-cedar-hover tracking-wider">© 2026 Roomify Interiors. All rights reserved.</p>
      </footer>
  )
}

export default Footer