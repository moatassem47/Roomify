import Loading from "../components/Loading";
import useAuth from "../store/authStore";
import ProfileSideBar from "../features/profile/ProfileSideBar";
import PersonalInformation from "../features/profile/PersonalInformation";
import ShippingAddress from "../features/profile/ShippingAddress";
import Security from "../features/profile/Security";
import CancelPopUp from "../components/CancelPopUp";
import { useState } from "react";
import api from "../utils/axios";
import toast from "react-hot-toast";
import useRequireVerified from '../hooks/useRequireVerified';
const Profile = () => {
  const user = useAuth((s)=>s.user);
  const logout  = useAuth((s)=>s.logout);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [password, setPassword] = useState("");
  const isVerified=useRequireVerified()
  if (!user) {
    return <Loading />;
  }

  const handleClick = async () => {
    try {
      const res = await api.delete("user/delete", {
        data: {
          password,
        },
      });
      setOpenPopUp(false);
      await logout();
      toast.success(res.data.message, {
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
    } catch (e) {
      toast.error( e.response?.data?.message || e.message || "Something went wrong");
    }
  };

  const formatedDate = new Date(user.createdAt).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isLocalUser = user.providers.includes("local");
  return (
    <div className="max-w-container-max mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-gutter">
        <ProfileSideBar
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          avatar={user.avatar}
        />
        <div className="flex-1 space-y-gutter">
          <PersonalInformation
            firstName={user.firstName}
            lastName={user.lastName}
            phone={user.phone}
            isVerified={isVerified}
          />
          <ShippingAddress
            streetAddress={user.address?.streetAddress}
            city={user.address?.city}
            isVerified={isVerified}
          />
          <Security isVerified={isVerified} isLocalUser={isLocalUser}/>
          <section
            className="bg-surface-container/50 p-8 rounded-xl border border-stone-200/40"
            id="status"
          >
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6">
              Account Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-4 bg-white rounded-xl custom-shadow">
                <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-1">
                  Email Address
                </p>
                <p className="font-body-md text-on-surface">{user.email}</p>
              </div>
              <div className="p-4 bg-white rounded-xl custom-shadow">
                <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-1">
                 Status
                </p>
                <p className="font-body-md text-on-surface">{user.isVerified?"Verified":"Not Verified"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl custom-shadow">
                <p className="text-xs font-semibold text-outline uppercase tracking-widest mb-1">
                  Member Since
                </p>
                <p className="font-body-md text-on-surface">{formatedDate}</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                className="text-error font-label-md hover:underline decoration-2 underline-offset-4"
                onClick={() => setOpenPopUp(true)}
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>
      {openPopUp && (
        <CancelPopUp
          title="Delete Account?"
          message="This action is permanent. Your account, profile, and all associated data will be permanently deleted and cannot be recovered."
          acceptMessage="Delete Account"
          refuseMessage="Cancel"
          setOpenPopUp={setOpenPopUp}
          handleClick={handleClick}
          children={
            <div className="space-y-2 flex flex-col mb-10">
              <label className="block font-label-md text-on-surface-variant ml-1">
                Confirm your password to permanently delete your account
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 outline-0 focus:ring-2 focus:ring-primary text-on-surface"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default Profile;
