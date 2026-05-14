import { useFormContext } from "react-hook-form";
import Input from "../../../components/common/Input";
import {EyeClosed,Eye} from "lucide-react"
import { useState } from "react";
import Button from "../../../components/common/Button";

const RegisterStep3 = ({ prevStep }) => {
  const [showPassword,setShowPassword]=useState(false)
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      
      
      <div className="flex flex-col md:flex-row gap-4">
        <Input
                register={register}
                error={errors.password}
                label="Password"
                name="password"
                placeHolder="••••••••••••"
                type={showPassword?`text`:`password`}
                children={showPassword?<EyeClosed className="absolute top-1/2 right-5" onClick={()=>setShowPassword(!showPassword)}/>:<Eye className="absolute top-1/2 right-5 " onClick={()=>setShowPassword(!showPassword)}/>}
         />
        <Input 
          register={register} 
          error={errors.confirmPassword} 
          name="confirmPassword" 
          label="Re-enter Password" 
          type="password" 
        />
      </div>

      
      <div className="flex flex-col mt-4 mb-6">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="terms"
            {...register("terms")} 
            className="w-5 h-5 mr-3 accent-brand-cedar cursor-pointer rounded-sm"
          />
          <label 
            htmlFor="terms" 
            className="font-sans text-sm text-brand-charcoal cursor-pointer select-none"
          >
            I agree to the{' '}
            <a href="#" className="text-brand-cedar font-semibold hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-brand-cedar font-semibold hover:underline">
              Privacy Policy
            </a>.
          </label>
        </div>
        
        
        {errors.terms && (
          <span className="text-brand-error text-xs mt-1 font-sans">
            {errors.terms.message}
          </span>
        )}
      </div>

      
      <div className="flex justify-between mt-2 gap-4">
        
        
       <Button
          type="button" 
          onClick={prevStep}
          className="w-1/2 bg-brand-surface-dim/30! text-brand-charcoal!   hover:bg-brand-surface-dim/50! "
        >
          Back
        </Button>


        
        <Button 
          type="submit" 
          className="w-2/3"
        >
          Create Account
        </Button>
        
      </div>
      
    </div>
  );
};

export default RegisterStep3;