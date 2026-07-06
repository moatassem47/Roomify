import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginSchema from "../schema/LoginSchema";
import Input from "../../../components/common/Input";
import useLogin from "../apis/useLogin";
import { EyeClosed, Eye } from "lucide-react";
import { useState } from "react";
import useAuth from "../../../store/authStore";
import Button from "../../../components/common/Button";
import UpdateMessage from "../../../components/common/UpdateMessage";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { closePopUp } = useAuth();
  const navigate = useNavigate();

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

  const handleClick = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const goToSignUp = () => {
    closePopUp();
    navigate("/signup");
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-large shadow-ambient p-8 w-full max-w-fit flex flex-col gap-1 mt-15"
    >
      <div className="mb-5">
        <h1 className="text-3xl text-center">Welcome Back</h1>
        <p className="font-sans text-brand-cedar text-center">
          Return to your sanctuary of curated comfort.
        </p>
      </div>

      {errors.root && (
        <div className="max-w-120 flex justify-center">
          <UpdateMessage message={errors.root.message} status="bad" />
        </div>
      )}

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
        type={showPassword ? `text` : `password`}
        children={
          showPassword ? (
            <EyeClosed
              className="absolute top-1/2 right-5"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <Eye
              className="absolute top-1/2 right-5"
              onClick={() => setShowPassword(!showPassword)}
            />
          )
        }
      />

      <span
        className="text-xs text-brand-text/90 cursor-pointer hover:text-brand-text"
        onClick={() => setShowForgotPassword(true)}
      >
        Forget Password?
      </span>

      <Button type="submit" className="mt-6">
        Sign in
      </Button>

      <div className="flex items-center gap-4 mt-3 mb-3">
        <div className="flex-1 bg-on-surface/20 h-0.5" />
        <p className="text-sm text-primary/80">OR</p>
        <div className="flex-1 bg-on-surface/20 h-0.5" />
      </div>

      <button
        onClick={() => handleClick()}
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
        New to Roomify?{" "}
        <button
          type="button"
          className="text-brand-cedar font-semibold cursor-pointer"
          onClick={goToSignUp}
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
