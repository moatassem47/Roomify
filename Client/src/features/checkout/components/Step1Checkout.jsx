import { useFormContext } from "react-hook-form";
import Input from "../../../components/Input";
import { egyptCities } from "../schema/cites";
import Button from "../../../components/Button";
const Step1Checkout = ({ nextStep }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-col gap-5">
      <Input
        register={register}
        name="shippingAddress.phone"
        label="Phone number"
        error={errors.shippingAddress?.phone}
        placeHolder="+20 0123456789"
        className="bg-brand-surface-container"
      />
      <Input
        register={register}
        name="shippingAddress.street"
        label="Street Address"
        error={errors.shippingAddress?.street}
        placeHolder="123 horya street"
        className="bg-brand-surface-container"
      />
      <div className="flex gap-5">
        <div className="flex flex-col gap-2 flex-1 relative">
          <label
            htmlFor="city"
            className="font-sans text-brand-cedar font-semibold text-sm"
          >
            City
          </label>
          <select
            {...register("shippingAddress.city")}
            className="bg-brand-surface-container rounded-base shadow-inset-soft h-12 pl-6 outline-0 placeholder:text-brand-surface-dim"
          >
            {egyptCities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          {errors.shippingAddress?.city && (
            <span className="text-brand-error text-xs mt-1 font-sans">
              {errors.shippingAddress.city.message}
            </span>
          )}
        </div>
        <Input
          register={register}
          type="number"
          name="shippingAddress.postalCode"
          label="Postalcode"
          error={errors.shippingAddress?.postalCode}
          placeHolder="232434"
          className="bg-brand-surface-container"
        />
      </div>
      <Button type="button" onClick={nextStep} children="Continue to Payment" />
    </div>
  );
};

export default Step1Checkout;
