import useAuth from "../../store/authStore";
import myIcon from "../../assets/icons/roomify-logo.svg";
import { ShoppingBag } from "lucide-react";
import UserDropdown from "./UserDropdown";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { NavLink, useNavigate } from "react-router-dom";
import useCart from "../../store/cartStore";
import { useGetCart } from "../../features/cart/apis/useCart";
import Categories from "../../pages/Categories";
import { useState } from "react";

const NavBar = () => {
  const { openPopUp, isAuthenticated } = useAuth();
  const [active,setActive]=useState(false)
  const navigate=useNavigate()
  const {totalQuantity}=useCart()


  useGetCart({ enabled: isAuthenticated });
  return (
    <>
    <nav className="bg-white flex items-center justify-between shadow-ambient h-20">
      <figure className="lg:w-80 w-44">
        <img src={myIcon} alt="logo"/>
      </figure>
      <ul className="md:flex gap-5 text-[#84746c] flex-2 justify-center [&>li:hover]:text-brand-cedar [&>li:hover]:cursor-pointer [&>li:active]:opacity-80 font-semibold hidden  ">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/shop">Shop All</NavLink>
         </li>
        <li>
          <button className={`cursor-pointer ${active&&`text-brand-cedar`}`} onClick={()=>setActive(!active)}>Categories</button>
        </li>
        <li>
          <NavLink to="/story">Our Story</NavLink>
        </li>
      </ul>

      <div className="flex max-w-70 flex-2 justify-center md:gap-8 gap-3 items-center">
        {isAuthenticated ? (
          <>
            <div className="relative inline-block cursor-pointer hover:-translate-y-1  transition-all duration-300 active:opacity-80"
            onClick={()=>navigate("/cart")}>
            <ShoppingBag color="#825031" />
            <span className={`absolute w-5 h-5 flex justify-center items-center bg-brand-cedar text-white rounded-full -top-2 -right-3 text-xs
              ${totalQuantity===0&&`hidden`}` }>
              {totalQuantity}
            </span>
            </div>
            <UserDropdown/>
          </>
        ) : (
          <>
            <Button
              className="text-brand-cedar! bg-white! px-0! py-0! shadow-none! md:text-base text-xs"
              onClick={() => openPopUp("login")}
            >
              Sign In
            </Button>
            <Button
              onClick={() => openPopUp("signUp")}
              className="md:text-base text-xs  md:size-auto size-7 flex justify-center items-center "
              
            >
              Join
            </Button>
           
          </>
        )}
         <MobileMenu />
      </div>
    </nav>
     {active&&
      <Categories setActive={setActive}/>
     }
    </>

  );
};

export default NavBar;
