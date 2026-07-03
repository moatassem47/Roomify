import { CreditCard, HandCoins ,LockKeyhole ,BadgeCheck,Shield} from "lucide-react";
import { useFormContext} from "react-hook-form";
import Button from "../../../components/common/Button";

const Step2Checkout = ({prevStep, nextStep}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const selectedPayment = watch("paymentMethod");

  return (
    <div className="flex flex-col gap-3">
      <label
        className={`h-20 w-full items-center flex bg-white justify-between p-5 border rounded-2xl cursor-pointer transition-all ${
          selectedPayment === "Cash"
            ? "border-brand-cedar bg-brand-surface-light ring-1 ring-brand-cedar"
            : "border-brand-surface-container"
        }`}
      >
        <div className="flex items-center gap-4">
          <input
            type="radio"
            value="Cash"
            {...register("paymentMethod")}
            className="size-5 border rounded-full accent-brand-cedar"
          />
          <div className="flex flex-col">
            <span className="font-medium text-brand-cedar">Cash On Delivery</span>
            <span className="text-sm text-on-surface-variant">Pay when your order arrives</span>
          </div>
        </div>
        <HandCoins className="text-on-surface" />
      </label>

     
        <label
          className={`h-20 w-full items-center bg-white flex justify-between p-5 border rounded-2xl cursor-pointer transition-all ${
            selectedPayment === "Card"
              ? "border-brand-cedar bg-brand-surface-light ring-1 ring-brand-cedar" 
              : "border-brand-surface-container "
          }`}
        >
          <div className="flex items-center gap-4">
            <input
              type="radio"
              value="Card"
              {...register("paymentMethod")}
              className="size-5 accent-brand-cedar"
            />
            <div className="flex flex-col">
              <span className="font-medium text-brand-cedar">
                Credit / Debit Card (Stripe)
              </span>
              <span className="text-sm text-on-surface-variant">
                Fast, secure checkout via Stripe
              </span>
            </div>
          </div>
          <CreditCard className="text-on-surface" />
        </label>

        {selectedPayment==="Card"&&
        <div className="h-30 bg-brand-surface-dim/60 p-5 shadow-sm rounded-2xl flex items-start gap-5">
            <LockKeyhole className="text-primary" size={20} />
            <div className="flex flex-col gap-2">
            <p className="text-sm w-100 text-brand-text">You will be redirected to Stripe's secure checkout page to complete your payment.
                We never store your card details on our servers.</p>
            <div className="flex gap-3"> 
                <div className="flex gap-1 items-center">
                    <BadgeCheck className="size-3 text-outline" />
                    <span className="text-xs text-outline">PCI Compliant</span>
                </div>
                <div className="flex gap-1 items-center">
                    <Shield className="size-3 text-outline" />
                    <span className="text-xs text-outline">SSL Encrypted</span>
                </div>
            </div>
            </div>
            
        </div>}
      
       {errors.paymentMethod && (
            <span className="text-brand-error text-xs mt-1 font-sans">
              {errors.paymentMethod.message}
            </span>
        )}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={prevStep}
          className="w-1/2 bg-brand-surface-dim! text-brand-charcoal! flex-1   hover:bg-brand-surface-dim/50! "
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          children="Continue to Review"
          className="flex-2"
        />
      </div>
    </div>
  );
};

export default Step2Checkout;
