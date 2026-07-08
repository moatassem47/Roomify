import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Eye, EyeClosed, KeyRound, CheckCircle2, XCircle } from "lucide-react";
import useChangePassword from "../features/auth/apis/useChangePassword";
import UpdateMessage from "../components/common/UpdateMessage";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useChangePassword();

  
  const hasMin = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!hasMin || !hasNumber) {
      setErrorMsg("Password does not meet the requirements below.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    mutate(
      { token, password },
      {
        onSuccess: () => {
          setSuccessMsg("Your password has been changed successfully.");
        },
        onError: (err) => {
          setErrorMsg(
            err?.message || "Reset link is invalid or has expired."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-ambient w-full max-w-3xl p-8 flex flex-col gap-6">

        
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cedar/10">
            <KeyRound className="h-8 w-8 text-brand-cedar" />
          </div>
          <h1 className="text-2xl font-semibold">Set New Password</h1>
          <p className="text-sm text-brand-cedar leading-6 max-w-3xl">
            Create a strong password for your Roomify account. You'll use it to
            sign in next time.
          </p>
        </div>

        {successMsg ? (
          <div className="flex flex-col items-center gap-5">
            <UpdateMessage message={successMsg} status="good" />
            <Link
              to="/"
              className="w-full text-center rounded-lg bg-brand-cedar px-6 py-3 font-semibold text-white transition hover:bg-brand-cedar/85"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {errorMsg && <UpdateMessage message={errorMsg} status="bad" />}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-text" htmlFor="rp-password">
                New Password
              </label>
              <div className="relative">
                <input
                  id="rp-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-brand-cedar transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-text" htmlFor="rp-confirm">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="rp-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-brand-cedar transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeClosed size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {password.length > 0 && (
              <ul className="flex flex-col gap-1 text-xs">
                <Requirement met={hasMin} label="At least 8 characters" />
              
                <Requirement met={hasNumber} label="At least one number" />
                {confirm.length > 0 && (
                  <Requirement met={passwordsMatch} label="Passwords match" />
                )}
              </ul>
            )}

  
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-brand-cedar py-3 font-semibold text-white transition hover:bg-brand-cedar/85 disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Reset Password"}
            </button>
          </form>
        )}


        <p className="text-center text-xs text-brand-text/60">
          Remember your password?{" "}
          <Link to="/" className="text-brand-cedar font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};


const Requirement = ({ met, label }) => (
  <li className={`flex items-center gap-2 ${met ? "text-green-600" : "text-gray-400"}`}>
    {met ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
    {label}
  </li>
);

export default ResetPassword;
