import { FormProvider, useForm } from "react-hook-form";
import registerSchema from "../schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegister from "../apis/useRegister";
import { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";
import {motion,AnimatePresence} from "framer-motion"
import useAuth from "../../../store/authStore";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const { mutate} = useRegister();
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    mode:"onTouched"
  });
  const {openPopUp}=useAuth()
  const { trigger, handleSubmit, setError ,formState:{errors} } = methods;

  const nextStep = async (fields) => {
    const isStepVaild = await trigger(fields);

    if (isStepVaild) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = (userData) => {
    const backendData = { ...userData };

    delete backendData.terms;
    delete backendData.confirmPassword;
    console.log("Submitting data:", backendData);
    mutate(backendData, {
      onError: (error) => {
        if (error.message === "User already exists") {
          setError("root", {
            type: "server",
            message: "This email is already exists. Try signing in.",
          });
        } else {
          console.log(error);
          setError("root", {
            type: "server",
            message: "Something went wrong. Please try again.",
          });
        }
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-large shadow-ambient p-8 w-full max-w-lg"
        layout
        transition={{duration:0.05}}
      >
        <div className="mb-5" >
          <h1 className="text-3xl">Create Account</h1>
          <span className="font-sans text-brand-cedar">
            Step into a world of curated comfort.
          </span>
        </div>

        <div className="mb-6 text-brand-cedar font-serif font-semibold text-xl">
          Step {step} of 3
        </div>
       <AnimatePresence mode="wait">
        <motion.div
        key={step}
        initial={{opacity:0,x:20}}
        animate={{opacity:100,x:0}}
        exit={{opacity:0,x:-20}}
        transition={{duration: 0.3, ease: "easeInOut"}}
        >
          {step === 1 && (
            <RegisterStep1
              nextStep={() =>
                nextStep(["firstName", "lastName", "email", "phone"])
              }
            />
          )}

          {step === 2 && (
            <RegisterStep2
              nextStep={() => nextStep(["address.city", "address.streetAddress"])}
              prevStep={prevStep}
            />
          )}

          {step === 3 && <RegisterStep3 prevStep={prevStep} />}
          {errors.root && (
          <p className="text-brand-error text-sm text-center mt-2">{errors.root.message}</p>
          )}
        </motion.div>

       </AnimatePresence>

        <p className="text-center mt-3">
        Already have an account?{" "}
        <a className="text-brand-cedar font-semibold cursor-pointer" onClick={()=>openPopUp("login")}>Sign in</a>
      </p>
      </motion.form>
    </FormProvider>
  );
};

export default RegisterForm;
