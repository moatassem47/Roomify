import { useState } from "react"
import { useCreateCardOrder, useCreateCashOrder } from "../apis/useOrder"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import orderSchema from "../schema/orderSchema"
import { useGetCart } from "../../cart/apis/useCart"

import BreadCrump from "./BreadCrump"
import Step1Checkout from "./Step1Checkout"
import Step2Checkout from "./Step2Checkout"
import Step3Checkout from "./Step3Checkout"

const CheckoutForm = () => {
    const [step,setStep]=useState(1)
    const {mutate:Card}=useCreateCardOrder()
    const {mutate:Cash}=useCreateCashOrder()
    const { data: cartData } = useGetCart()
    const methods=useForm({
        resolver:zodResolver(orderSchema),
        mode:"onTouched"
    })

    const {trigger,handleSubmit,setError,formState:{errors}}=methods

   const nextStep=async(Fields)=>{
        const isVaild=await trigger(Fields)
        if(isVaild){
            setStep(step+1)
        }
   }

   const prevStep=()=>{
    if(step>1){
        setStep(step-1)
    }
   }

   const onSubmit=(orderData)=>{
    // Build items array from local cart for the backend
    const items = (cartData?.cart?.items || []).map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }))

    const payload = { ...orderData, items }

    if(orderData.paymentMethod==="Cash"){
        Cash(payload, {
      onError: (error) => {
          console.error(error);
          setError("root", {
            type: "server",
            message: error?.message || "Something went wrong. Please try again.",
          });
      },
    })
    }else{
        Card(payload, {
      onError: (error) => {
          console.error(error);
          setError("root", {
            type: "server",
            message: error?.message || "Something went wrong. Please try again.",
          });
      },
    })
    }
   }
  return (
    <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 lg:flex-2 flex flex-col gap-7">
        <div>
            <h1 className="text-brand-cedar font-semibold text-2xl lg:text-4xl">Secure Checkout</h1>
            <p className="text-brand-cedar-hover text-sm tracking-wide">Complete your purchase for a more comfortable home.</p>
        </div>
        <BreadCrump step={step} setStep={setStep}/>

        {
            step===1 && <Step1Checkout nextStep={() => nextStep(["shippingAddress.city","shippingAddress.street","shippingAddress.phone","shippingAddress.postalCode"])}/>
        }

         {
            step===2 && <Step2Checkout prevStep={prevStep}  nextStep={() => nextStep(["paymentMethod"])}/>
        }

         {
            step===3 && <Step3Checkout setStep={setStep}/>
        }
        {errors.root && (
          <p className="text-brand-error text-sm text-center mt-2">{errors.root.message}</p>
          )}
        </form>
    </FormProvider>
  )
}

export default CheckoutForm