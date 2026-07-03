import myIcon from "../../../assets/icons/roomify-logo-white.svg";
const RegisterWallpaper = () => {
  return (
   
    <div className="relative lg:flex flex-col justify-between flex-1 bg-[url('/src/assets/images/RegisterWallPaper.png')] bg-cover bg-center bg-no-repeat w-80 px-10 py-10 hidden ">
        
       
        <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/90 via-transparent to-transparent"></div>

       
        <img src={myIcon} className="w-70 relative z-10" alt="Roomify Logo" />
        
        <div className="flex flex-col gap-5 drop-shadow-2xl  relative z-10">
            <h2 className="text-white text-4xl font-bold w-100">
                Design your sanctuary.
            </h2>
            <span className="text-white text-xl w-110 mb-5">
                Join a community of curators who value quality, comfort, and the art of living well.
            </span>
        </div>
    </div>
  )
}

export default RegisterWallpaper;