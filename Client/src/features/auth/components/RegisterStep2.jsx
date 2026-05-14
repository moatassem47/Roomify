import { useFormContext } from "react-hook-form";
import Input from "../../../components/common/Input"; 
import Button from "../../../components/common/Button";

const RegisterStep2 = ({ nextStep, prevStep }) => {

  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      
   
      <div className="flex flex-col  md:flex-col gap-4">
        <Input 
          register={register} 
       
          error={errors?.address?.city} 
          name="address.city" 
          label="City" 
        />
        <Input 
          register={register} 
          error={errors?.address?.streetAddress} 
          name="address.streetAddress" 
          label="Street Address" 
        />
      </div>

     
      <div className="flex justify-between mt-6 gap-4">
        
       
        <Button 
          type="button" 
          onClick={prevStep}
          className="w-1/2 bg-brand-surface-dim/30! text-brand-charcoal!   hover:bg-brand-surface-dim/50! "
        >
          Back
        </Button>

        
        <Button
          type="button" 
          onClick={nextStep}
          className="w-1/2"
        >
          Next Step
        </Button>
        
      </div>
      
    </div>
  );
};

export default RegisterStep2;