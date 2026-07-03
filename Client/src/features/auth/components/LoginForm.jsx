import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../schema/LoginSchema";
import Input from "../../../components/common/Input";
import useLogin from "../apis/useLogin";
import {EyeClosed,Eye} from "lucide-react"
import { useState } from "react";
import useAuth from "../../../store/authStore";
import Button from "../../../components/common/Button";


const LoginForm = () => {

    const [showPassword,setShowPassword]=useState(false)
    const {openPopUp}=useAuth()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate } = useLogin();

  const onSubmit = (data) => {
    console.log(data);
    mutate(data, {
      onError: (error) => {
        setError("root", {
          type: "server",
          message: error.message,
        });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-large shadow-ambient p-8 w-full max-w-fit flex flex-col gap-3"
    >
      <div className="mb-5">
        <h1 className="text-3xl text-center">Welcome Back</h1>
        <p className="font-sans text-brand-cedar text-center">
          Return to your sanctuary of curated comfort.
        </p>
      </div>

      <Input
        register={register}
        error={errors.email}
        label="Email Address"
        name="email"
        placeHolder="Sam@example.com"
      />
      <Input
        register={register}
        error={errors.password}
        label="Password"
        name="password"
        placeHolder="••••••••••••"
        type={showPassword?`text`:`password`}
        children={showPassword?<EyeClosed className="absolute top-1/2 right-5" onClick={()=>setShowPassword(!showPassword)}/>:<Eye className="absolute top-1/2 right-5" onClick={()=>setShowPassword(!showPassword)}/>}
      />
        {errors.root && (
          <p className="text-brand-error text-sm text-center">
            {errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="mt-6"
        >
          Sign in
        </Button>
      <p className="text-center mt-3">
        New to Roomify?{" "}
        <a className="text-brand-cedar font-semibold cursor-pointer" onClick={()=>openPopUp("signUp")}>Sign up</a>
      </p>
    </form>
  );
};

export default LoginForm;
