import useAuth from "../store/authStore";
import myIcon from "../assets/icons/roomify-logo.svg";
import { ShoppingBag, User } from "lucide-react";
import UserDropdown from "./UserDropdown";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import { NavLink, useNavigate } from "react-router-dom";
import { useGetCart } from "../features/cart/apis/useCart";
import { useState } from "react";
import useRequireVerified from '../hooks/useRequireVerified';

const NavBar = () => {
  const  isAuthenticated = useAuth((s)=>s.isAuthenticated);
  const user = useAuth((s)=>s.user);
  const [isOpen, setIsOpen] = useState(false);
  const isVerified = useRequireVerified();
  const { data } = useGetCart({ enabled: Boolean(isAuthenticated && user?.isVerified) });
  const totalQuantity = data?.totalQuantity || 0;
  const navigate = useNavigate();

  const handleCartClick = () => {
  if (!isVerified()) return;
  navigate("/cart");
};
  return (
    <>
      <nav className="bg-white fixed right-0 left-0 top-0 z-50 flex items-center justify-between shadow-ambient h-20">
        <figure className="lg:w-80 w-44">
          <img src={myIcon} alt="logo" />
        </figure>
        <ul className="md:flex gap-5 text-outline flex-2 justify-center [&>li:hover]:text-brand-cedar [&>li:hover]:cursor-pointer [&>li:active]:opacity-80 font-semibold hidden  ">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/shop">Shop All</NavLink>
          </li>
          <li>
            <NavLink to="/story">Our Story</NavLink>
          </li>
        </ul>

        <div className="flex max-w-70 flex-2 justify-center md:gap-8 gap-3 items-center">
          {isAuthenticated ? (
            <>
              <div
                className="relative inline-block cursor-pointer hover:-translate-y-1  transition-all duration-300 active:opacity-80"
                onClick={() =>handleCartClick()}
              >
                <ShoppingBag color="#825031" />
                <span
                  className={`absolute w-5 h-5 flex justify-center items-center bg-brand-cedar text-white rounded-full -top-2 -right-3 text-xs
              ${totalQuantity === 0 && `hidden`}`}
                >
                  {totalQuantity}
                </span>
              </div>
              <UserDropdown
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                links={[{to:"/profile",label:"My Profile"},{to:"/orders",label:"My Orders"}]}
                className={"right-0 mt-3"}
                children={
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <User
                      color="#825032"
                      className="cursor-pointer hover:-translate-y-1  transition-all duration-300 active:opacity-80"
                    />
                  </button>
                }
              />
            </>
          ) : (
            <>
              <Button
                className="text-brand-cedar! bg-white! px-0! py-0! shadow-none! md:text-base text-xs"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="md:text-base text-xs  md:size-auto size-7 flex justify-center items-center "
              >
                Join
              </Button>
            </>
          )}
          <MobileMenu />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
