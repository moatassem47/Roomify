import { useFormContext } from "react-hook-form"
import useAuth from "../../../store/authStore"
import Button from "../../../components/common/Button"


const Step3Checkout = ({setStep}) => {
    const user=useAuth((s)=>s.user)
    const {getValues}=useFormContext()

    
  
  const phone = getValues("shippingAddress.phone");
  const paymentMethod = getValues("paymentMethod");
  const street = getValues("shippingAddress.street");
  

  return (
    <div className="flex flex-col gap-5">
    <div className="grid grid-cols-1 bg-white rounded-2xl">
     <div className=" border p-5 h-fit border-brand-surface-container border-b-0 rounded-t-2xl flex flex-col gap-2">
        <div className=" flex justify-between ">
            <span className="text-brand-cedar ">Shipping To</span>
            <span className="text-brand-cedar font-semibold cursor-pointer" onClick={()=>setStep(1)} >Edit</span>
        </div>
        <span className="font-semibold">{user.firstName} {user.lastName}</span>
        <span className="text-sm text-brand-text">{phone}</span>
        <span className="text-sm text-brand-text">{street} </span>
     </div>
     <div className=" border  h-fit p-5 border-brand-surface-container rounded-b-2xl flex flex-col gap-2"> 
         <div className=" flex justify-between ">
            <span className="text-brand-cedar ">Payment Method</span>
          <span className="text-brand-cedar font-semibold cursor-pointer" onClick={()=>setStep(2)} >Edit</span>
        </div>
        {paymentMethod==="Cash"&&<span className="font-semibold">Cash on Delivery</span>}
        {paymentMethod==="Card"&&<span className="font-semibold">Stripe (Credit/Debit Card)</span>}
     </div>
    </div>
     <Button children={"Place Order"} type="submit" />
    </div>
  )
}

export default Step3Checkout