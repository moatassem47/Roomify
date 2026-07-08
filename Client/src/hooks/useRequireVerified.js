import useAuth from "../store/authStore";

const useRequireVerified = () => {
  const  user = useAuth((s)=>s.user);
  const  openPopUp = useAuth((s)=>s.openPopUp);

  return () => {
    if (!user?.isVerified) {
      openPopUp("verifyEmail");
      return false;
    }

    return true;
  };
};

export default useRequireVerified;