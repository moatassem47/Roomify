import { MailCheck } from "lucide-react";

import Button from "../../../components/common/Button";
import useAuth from "../../../store/authStore";
import useResendVerficationEmail from "../apis/useResendVerficationEmail";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useChangeVerificationEmail from "../apis/useChangeVerificationEmail";
const RegisterVerifeyEmail = ({ email }) => {
  const { openPopUp, updateUser } = useAuth();
  const { mutate, isPending } = useResendVerficationEmail();
  const { mutate: changeEmail, isPending: isChangingEmail } =
    useChangeVerificationEmail();
  const [currentEmail, setCurrentEmail] = useState(email || "");
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    setCurrentEmail(email || "");
  }, [email]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const onResend = () => {
    if (!currentEmail || timeLeft > 0 || isPending) return;

    mutate(currentEmail, {
      onSuccess: (data) => {
        toast.success(data.message, {
          duration: 2000,
          position: "bottom-center",
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        setTimeLeft(60);
      },
      onError:(error)=>{
        toast.error(error?.message || "Something went wrong. Please try again later.")
      }
    });
  };

  const onChangeEmail = (event) => {
    event.preventDefault();

    const trimmedEmail = newEmail.trim();
    if (!trimmedEmail || isChangingEmail) return;

    changeEmail(trimmedEmail, {
      onSuccess: (data) => {
        const updatedEmail = data?.data?.email || trimmedEmail;
        updateUser({ email: updatedEmail, isVerified: false });
        setCurrentEmail(updatedEmail);
        setNewEmail("");
        setIsEditingEmail(false);
        setTimeLeft(60);
        toast.success(data.message || "Verification email sent successfully.", {
          duration: 2000,
          position: "bottom-center",
        });
      },
      onError: (error) => {
        toast.error(
          error?.message || "Could not update email. Please try again later.",
        );
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-large bg-white p-4 text-center shadow-ambient sm:p-8">
      <div className="w-20 h-20 rounded-full bg-brand-cedar/10 flex items-center justify-center mb-6">
        <MailCheck className="w-10 h-10 text-brand-cedar" />
      </div>

      <h2 className="text-3xl font-semibold mb-3">Check your email</h2>

      <p className="text-brand-cedar max-w-3xl leading-7">
        We've sent a verification link to
      </p>

      <p className="mt-2 break-all text-base font-semibold sm:text-lg">
        {currentEmail || "your email address"}
      </p>

      <p className="text-brand-cedar mt-6 leading-7">
        Please verify your email
      </p>

      <button
        type="button"
        onClick={() => setIsEditingEmail((isEditing) => !isEditing)}
        className="mt-3 text-sm font-semibold text-brand-cedar underline"
      >
        Wrong email?
      </button>

      {isEditingEmail && (
        <form onSubmit={onChangeEmail} className="mt-4 flex w-full flex-col gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="Enter the correct email"
            className="w-full rounded-lg border border-brand-cedar/30 px-4 py-3 outline-none focus:border-brand-cedar"
          />
          <Button
            type="submit"
            disabled={isChangingEmail || !newEmail.trim()}
            className={`${isChangingEmail || !newEmail.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isChangingEmail ? "Sending..." : "Update Email"}
          </Button>
        </form>
      )}
       
       {timeLeft > 0 && (
          <p className="text-sm text-gray-500 text-center">
            You can resend the email in{" "}
            <span className="font-semibold">{timeLeft}s</span>.
          </p>
        )}

      <div className="flex flex-col w-full gap-3 mt-8">
        <Button
          type="button"
          onClick={onResend}
          disabled={timeLeft > 0 || isPending || !currentEmail}
          className={`${timeLeft > 0 || isPending || !currentEmail ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPending ? "Sending..." : "Resend Email"}
        </Button>

        <button
          type="button"
          onClick={() => openPopUp("login")}
          className="border border-brand-cedar text-brand-cedar rounded-lg py-3 font-medium hover:bg-brand-cedar hover:text-white transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegisterVerifeyEmail;
