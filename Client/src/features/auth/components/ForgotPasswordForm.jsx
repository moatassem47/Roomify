import { useState } from "react";
import Button from "../../../components/common/Button";
import UpdateMessage from "../../../components/common/UpdateMessage";
import useForgotPassword from "../apis/useForgotPassword";

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    mutate(email.trim(), {
      onSuccess: () => {
        setSuccessMsg(
          "If an account with that email exists, we've sent a password reset link. Please check your inbox and spam folder."
        );
      },
      onError: (error) => {
        setErrorMsg(
          error?.message || "Something went wrong. Please try again."
        );
      },
    });
  };

  return (
    <>
    
      {errorMsg && (
        <div className="max-w-120 flex justify-center">
          <UpdateMessage message={errorMsg} status="bad" />
        </div>
      )}

    <div className="bg-white rounded-large shadow-ambient p-8 w-full max-w-fit flex flex-col gap-4 mt-15">
      
      <div className="mb-2">
        <h1 className="text-3xl text-center">Forgot your password?</h1>
        <p className="font-sans text-brand-cedar text-center mt-2 max-w-96">
          Enter the email address associated with your account, and we'll send
          you a link to reset your password.
        </p>
      </div>

      {successMsg && (
        <div className="max-w-120 flex justify-center">
          <UpdateMessage message={successMsg} status="good" />
        </div>
      )}
      
      
      {!successMsg && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="forgot-email"
              className="text-sm font-medium text-brand-text"
            >
              Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              placeholder="sam@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-brand-cedar transition-colors w-96"
            />
          </div>

          <Button type="submit" className="mt-2" disabled={isPending}>
            {isPending ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      )}

      
      <button
        type="button"
        onClick={onBack}
        className="text-xs text-brand-text/70 hover:text-brand-text transition-colors text-center mt-1 cursor-pointer"
      >
        ← Back to Sign in
      </button>
    </div>
    </>
  );
};

export default ForgotPasswordForm;
