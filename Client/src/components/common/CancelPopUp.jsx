import { TriangleAlert } from "lucide-react";
import { createPortal } from "react-dom";


const CancelPopUp = ({setOpenPopUp,title,handleClick,message,acceptMessage,refuseMessage,children}) => {
   
  return createPortal(
    <div
      className="fixed inset-0 z-50  flex items-center justify-center p-gutter bg-black/20  transition-opacity duration-300 opacity-100"
    >
      <div className="bg-surface-container-lowest w-full max-w-120 rounded-xl soft-elevation overflow-hidden transform transition-all scale-100 p-lg flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-md">
          <span className="material-symbols-outlined text-error text-[32px]">
           <TriangleAlert />
          </span>
        </div>

        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
         {title}
        </h2>
        <p className="text-on-surface-variant font-body-md mb-lg">
         {message}
        </p>
        {children}
        <div className="w-full flex flex-col gap-sm">
          <button
            className="w-full py-md bg-error text-on-error font-label-md text-label-md rounded-lg hover:shadow-lg transition-all active:opacity-90"
            onClick={()=>handleClick()}
          >
            {acceptMessage}
          </button>
          <button
            className="w-full py-md bg-surface-container text-on-surface-variant font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-all"
            onClick={()=>setOpenPopUp(false)}
          >
           {refuseMessage}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CancelPopUp;
