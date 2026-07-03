import {Lock ,Eye,EyeClosed} from "lucide-react";
import { useState } from "react";
import z from "zod";
import useAuth from "../../store/authStore";
import { useForm } from "react-hook-form";
import api from "../../utils/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import UpdateMessage from "./UpdateMessage";

const Security = () => {
  const profileSchema = z.object({
    password:z.string().trim().min(1, "Current password is required"),
    newPassword: z.string()
       .trim()
       .min(8, "Password must be at least 8 characters")
       .max(30, "Password is too long")
       .regex(/[0-9]/, "Password must include at least one number")
       .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
        confirmPassword: z.string().trim(),
  }).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState(null);
  const { updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({resolver: zodResolver(profileSchema),});

  const onSubmit = async (data) => {
    try {
      const res = await api.patch(`user/edit`,{
        password:data.password,
        newPassword:data.newPassword
      });
      updateUser(res.data.user);
      setMessage({
        status: "good",
        text: "Password changed successfully. Your profile has been updated.",
      });
      reset()
    } catch (e) {
      setMessage({
        status: "bad",
        text: e.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <>
      {message && (
          <UpdateMessage message={message.text} status={message.status} />
        )}
      <section className="bg-white p-8 rounded-xl custom-shadow" id="Security">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Security
            </h2>
            <span className=" text-outline">
              <Lock />
            </span>
          </div> 
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                  placeholder="••••••••"
                  type={showCurrent ? "text" : "password"}
                  {...register("password")}
                />
               <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline"
               onClick={()=>setShowCurrent(!showCurrent)}>{showCurrent?<EyeClosed />:<Eye />}</button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-label-md text-on-surface-variant ml-1">
                  New Password
                </label>
                <div className="relative">
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                  type={showNew ? "text" : "password"}
                  {...register("newPassword")}
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline"
               onClick={()=>setShowNew(!showNew)}>{showNew?<EyeClosed />:<Eye />}</button>
                </div>
                {errors.newPassword && (
                <p className="text-red-500">{errors.newPassword.message}</p>
              )}
              </div>
              <div className="space-y-2">
                <label className="block font-label-md text-on-surface-variant ml-1">
                  Confirm New Password
                </label>
               
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                  type="password"
                  {...register("confirmPassword")}
                />
                
               
                {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
             <button
              className="px-8 py-3 bg-primary text-white rounded-xl font-label-md shadow-lg hover:bg-primary-container transition-all"
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Security;
