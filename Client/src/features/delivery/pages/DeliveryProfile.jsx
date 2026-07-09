import { useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, Truck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import useAuth from "../../../store/authStore";

const DeliveryProfile = () => {
  const user = useAuth((s)=>s.user);
  const  logout  = useAuth((s)=>s.logout);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (!user) return <Loading text="Loading profile..." />;

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold">My Profile</h2>
        <p className="text-on-surface-variant">
          View your delivery account information.
        </p>
      </div>

      <section className="rounded-lg border border-surface-variant bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserRound className="text-primary" size={34} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm font-semibold uppercase text-outline">
                Delivery
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-brand-error px-4 py-2 text-sm font-semibold text-brand-error hover:bg-brand-error-container/30"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-surface-container-low p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-outline">
              <Mail size={16} />
              Email
            </div>
            <p className="mt-2 font-medium">{user.email}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-outline">
              <Phone size={16} />
              Phone
            </div>
            <p className="mt-2 font-medium">{user.phone || "Not available"}</p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-outline">
              <Truck size={16} />
              Vehicle
            </div>
            <p className="mt-2 font-medium">
              {user.deliveryDetails?.vehicleType || "Not available"}
            </p>
          </div>
          <div className="rounded-lg bg-surface-container-low p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-outline">
              <Truck size={16} />
              License plate
            </div>
            <p className="mt-2 font-medium">
              {user.deliveryDetails?.licensePlate || "Not available"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryProfile;
