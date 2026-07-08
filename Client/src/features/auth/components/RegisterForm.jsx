import { FormProvider, useForm } from "react-hook-form";
import registerSchema from "../schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useRegister from "../apis/useRegister";
import { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../../store/authStore";
import {useNavigate} from "react-router-dom"

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const Navigate=useNavigate()
  const { mutate, isPending } = useRegister();
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });
  const openPopUp = useAuth((s)=>s.openPopUp);
  const  login = useAuth((s)=>s.login);
  const {
    trigger,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const nextStep = async (fields) => {
    const isStepVaild = await trigger(fields);

    if (isStepVaild) {
      setStep((currentStep) => currentStep + 1);
    }
  };

  const prevStep = () => setStep((currentStep) => Math.max(1, currentStep - 1));

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
      onSuccess: (data) => {
        console.log("Registration successful! Response data:", data);
        login(data?.data);
        openPopUp("verifyEmail")
      },
    });
  };

  const handleClick = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <FormProvider {...methods}>
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full  flex-col rounded-large bg-white p-4 shadow-ambient sm:p-6 md:p-8 lg:max-w-none lg:overflow-y-auto"
        layout
        transition={{ duration: 0.05 }}
      >
        <div className="mb-4 mt-1 md:mb-5 md:mt-3">
          <h1 className="text-2xl sm:text-3xl">Create Account</h1>
          <span className="font-sans text-brand-cedar">
            Step into a world of curated comfort.
          </span>
        </div>

        <div className="mb-4 font-serif text-lg font-semibold text-brand-cedar sm:mb-6 sm:text-xl">
          Step {step} of 3
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
                nextStep={() =>
                  nextStep(["address.city", "address.streetAddress"])
                }
                prevStep={prevStep}
              />
            )}

            {step === 3 && (
              <RegisterStep3 prevStep={prevStep} isSubmitting={isPending} />
            )}
            {errors.root && (
              <p className="text-brand-error text-sm text-center mt-2">
                {errors.root.message}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="my-4 flex items-center gap-4">
          <div className="flex-1 bg-on-surface/20 h-0.5" />
          <p className="text-sm  text-primary/80">OR</p>
          <div className="flex-1 bg-on-surface/20 h-0.5" />
        </div>
        <button
          onClick={handleClick}
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.98]"
        >
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/fluency/48/google-logo.png"
            alt="google-logo"
          />
          <span>Continue with Google</span>
        </button>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a
            className="text-brand-cedar font-semibold cursor-pointer"
            onClick={() => Navigate("/login")}
          >
            Sign in
          </a>
        </p>
      </motion.form>
    </FormProvider>
  );
};

export default RegisterForm;
