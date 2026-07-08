import { MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../../components/common/Button";
import useAuth from "../../../store/authStore";
import useResendVerficationEmail from "../apis/useResendVerficationEmail";
import useChangeVerificationEmail from "../apis/useChangeVerificationEmail";

const RegisterVerifeyEmail = () => {
  const  updateUser = useAuth((s)=>s.updateUser);
  const  user  = useAuth((s)=>s.user);

  const { mutate, isPending } = useResendVerficationEmail();
  const { mutate: changeEmail, isPending: isChangingEmail } =
    useChangeVerificationEmail();

  const [currentEmail, setCurrentEmail] = useState(user?.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hasSentEmail, setHasSentEmail] = useState(false);

  useEffect(() => {
    if (!hasSentEmail || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasSentEmail]);

  const onSendEmail = () => {
    if (!currentEmail || isPending) return;

    if (hasSentEmail && timeLeft > 0) return;

    mutate(currentEmail, {
      onSuccess: (data) => {
        setHasSentEmail(true);
        setTimeLeft(60);

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
      },
      onError: (error) => {
        toast.error(
          error?.message || "Something went wrong. Please try again later."
        );
      },
    });
  };

  const onChangeEmail = (event) => {
    event.preventDefault();

    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail || isChangingEmail) return;

    changeEmail(trimmedEmail, {
      onSuccess: (data) => {
        const updatedEmail = data?.data?.email || trimmedEmail;

        updateUser({
          email: updatedEmail,
          isVerified: false,
        });

        setCurrentEmail(updatedEmail);
        setNewEmail("");
        setIsEditingEmail(false);

        // Reset sending state for the new email
        setHasSentEmail(false);
        setTimeLeft(60);

        toast.success(
          data.message || "Email updated successfully.",
          {
            duration: 2000,
            position: "bottom-center",
          }
        );
      },
      onError: (error) => {
        toast.error(
          error?.message ||
            "Could not update email. Please try again later."
        );
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-large bg-white p-4 text-center shadow-ambient sm:p-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-cedar/10">
        <MailCheck className="h-10 w-10 text-brand-cedar" />
      </div>

      <h2 className="mb-3 text-3xl font-semibold">
        Verify Your Email
      </h2>

      <p className="max-w-3xl leading-7 text-brand-cedar">
        {hasSentEmail
          ? "We've sent a verification link to:"
          : "To activate your account, send a verification email to:"}
      </p>

      <p className="mt-2 break-all text-base font-semibold sm:text-lg">
        {currentEmail || "your email address"}
      </p>

      <p className="mt-6 leading-7 text-brand-cedar">
        {hasSentEmail
          ? "Please check your inbox (and spam folder) and click the verification link."
          : "Click the button below to receive your verification email."}
      </p>

      <button
        type="button"
        onClick={() => setIsEditingEmail((prev) => !prev)}
        className="mt-3 text-sm font-semibold text-brand-cedar underline"
      >
        Wrong email?
      </button>

      {isEditingEmail && (
        <form
          onSubmit={onChangeEmail}
          className="mt-4 flex w-full flex-col gap-3"
        >
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter the correct email"
            className="w-full rounded-lg border border-brand-cedar/30 px-4 py-3 outline-none focus:border-brand-cedar"
          />

          <Button
            type="submit"
            disabled={isChangingEmail || !newEmail.trim()}
            className={
              isChangingEmail || !newEmail.trim()
                ? "cursor-not-allowed opacity-50"
                : ""
            }
          >
            {isChangingEmail ? "Updating..." : "Update Email"}
          </Button>
        </form>
      )}

      {hasSentEmail && timeLeft > 0 && (
        <p className="mt-5 text-center text-sm text-gray-500">
          You can resend the email in{" "}
          <span className="font-semibold">{timeLeft}s</span>.
        </p>
      )}

      <div className="mt-8 flex w-full flex-col gap-3">
        <Button
          type="button"
          onClick={onSendEmail}
          disabled={
            isPending ||
            !currentEmail ||
            (hasSentEmail && timeLeft > 0)
          }
          className={
            isPending ||
            !currentEmail ||
            (hasSentEmail && timeLeft > 0)
              ? "cursor-not-allowed opacity-50"
              : ""
          }
        >
          {isPending
            ? "Sending..."
            : hasSentEmail
            ? "Resend Email"
            : "Send Verification Email"}
        </Button>
      </div>
    </div>
  );
};

export default RegisterVerifeyEmail;