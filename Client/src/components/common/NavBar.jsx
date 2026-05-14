import useAuth from "../../store/authStore";
import myIcon from "../../assets/icons/roomify-logo.svg";
import { ShoppingBag } from "lucide-react";
import UserDropdown from "./UserDropdown";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { NavLink } from "react-router-dom";
const NavBar = () => {
  const { openPopUp, isAuthenticated } = useAuth();
  return (
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
          <NavLink to="/categories">Categories</NavLink>
        </li>
        <li>
          <NavLink to="/story">Our Story</NavLink>
        </li>
      </ul>

      <div className="flex max-w-70 flex-2 justify-center md:gap-8 gap-3 items-center">
        {isAuthenticated ? (
          <>
            <ShoppingBag color="#825032" className="cursor-pointer hover:-translate-y-1  transition-all duration-300 active:opacity-80" />
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
  );
};

export default NavBar;
