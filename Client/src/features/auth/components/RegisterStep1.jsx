import { useFormContext } from "react-hook-form";
import Input from "../../../components/common/Input"; 
import Button from "../../../components/common/Button";

const RegisterStep1 = ({ nextStep }) => {
  
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input 
          register={register} 
          error={errors.firstName} 
          name="firstName" 
          label="First Name"
            placeHolder="Mark"
        />
        <Input 
          register={register} 
          error={errors.lastName} 
          name="lastName" 
          label="Last Name"
           placeHolder="Smith"
          
        />
      </div>

      
      <Input 
        register={register} 
        error={errors.email} 
        name="email" 
        label="Email Address" 
        type="email"
         placeHolder="mark@example.com"
      />
      <Input 
        register={register} 
        error={errors.phone} 
        name="phone" 
        label="Phone Number" 
        placeHolder="+20 1234567891"
      />

      
      <Button
        type="button" 
        onClick={nextStep}
        className="mt-6"
      >
        Next Step
      </Button>
      
    </div>
  );
};

export default RegisterStep1;
