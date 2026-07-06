import { BadgeCheck, CircleX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import useFetchQuery from "../hooks/useFetchQuery";
import useAuth from "../store/authStore";
import { useEffect } from "react";

const VerifyEmail = () => {
  const { token } = useParams();
  const { checkAuth, isAuthenticated } = useAuth();
  const { data, isLoading, isError, error } = useFetchQuery(
    token ? `/auth/verify-email/${token}` : "",
    ["verify-email", token],
    {
      enabled: Boolean(token),
      retry: false,
    },
  );

  useEffect(() => {
    if (data && !isError && isAuthenticated) {
      checkAuth();
    }
  }, [checkAuth, data, isAuthenticated, isError]);

  if (isLoading) {
    return <Loading />;
  }

  const hasVerificationFailed = !token || isError || data?.success === false;
  const errorMessage =
    error?.message ||
    data?.message ||
    "This verification link is invalid or has expired. Please request a new verification email.";

  if (hasVerificationFailed) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-brand-cream p-4 text-center sm:p-8">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
          <CircleX className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="mb-3 text-2xl font-semibold sm:text-3xl">
          Verification Failed
        </h1>

        <p className="max-w-3xl leading-7 text-brand-cedar">{errorMessage}</p>

        <Link
          to="/"
          className="mt-4 rounded-lg bg-brand-cedar px-6 py-3 font-semibold text-white transition hover:bg-brand-cedar-hover"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-brand-cream p-4 text-center sm:p-8">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
        <BadgeCheck className="h-12 w-12 text-green-600" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold sm:text-3xl">
        Email Verified
      </h1>

      <p className="max-w-3xl leading-7 text-brand-cedar">
        {data?.message ||
          "Your email has been verified successfully. Your Roomify account is now ready to use."}
      </p>

      <Link
        to="/"
        className="mt-4 rounded-lg bg-brand-cedar px-6 py-3 font-semibold text-white transition hover:bg-brand-cedar-hover"
      >
        Continue to Roomify
      </Link>
    </div>
  );
};

export default VerifyEmail;
