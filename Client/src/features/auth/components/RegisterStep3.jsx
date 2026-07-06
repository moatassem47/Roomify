import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const RegisterStep3 = ({ prevStep, isSubmitting = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-2 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          register={register}
          error={errors.password}
          label="Password"
          name="password"
          placeHolder="Enter your password"
          type={showPassword ? "text" : "password"}
        >
          {showPassword ? (
            <EyeClosed
              className="absolute right-5 top-1/2 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="absolute right-5 top-1/2 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </Input>

        <Input
          register={register}
          error={errors.confirmPassword}
          name="confirmPassword"
          label="Re-enter Password"
          type="password"
          placeHolder="Re-enter your password"
        />
      </div>

      <div className="mb-6 mt-4 flex flex-col">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            {...register("terms")}
            className="mr-3 mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm accent-brand-cedar"
          />
          <label
            htmlFor="terms"
            className="cursor-pointer select-none font-sans text-sm text-brand-charcoal"
          >
            I agree to the{" "}
            <a href="#" className="font-semibold text-brand-cedar hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-brand-cedar hover:underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {errors.terms && (
          <span className="mt-1 font-sans text-xs text-brand-error">
            {errors.terms.message}
          </span>
        )}
      </div>

      <div className="mt-2 flex gap-4">
        <Button
          type="button"
          onClick={prevStep}
          className="w-1/2 bg-brand-surface-dim/30! text-brand-charcoal! hover:bg-brand-surface-dim/50!"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={`w-2/3 ${isSubmitting ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </div>
    </div>
  );
};

export default RegisterStep3;
