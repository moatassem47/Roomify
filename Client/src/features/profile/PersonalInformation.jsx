import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import useAuth from "../../store/authStore";
import api from "../../utils/axios";
import z from "zod";
import UpdateMessage from "../../components/common/UpdateMessage";
import { useState } from "react";

const profileSchema = z.object({
  firstName: z.string().min(2,"First name must be at least 2 characters"),
  lastName: z.string().min(2,"Last name must be at least 2 characters"),
  phone: z.string().min(11,"Phone must be 11 characters"),
});

const PersonalInformation = ({ firstName, lastName, phone ,isVerified}) => {
  const [message, setMessage] = useState(null);
  const updateUser = useAuth((s)=>s.updateUser);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    },
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data) => {
    if(isVerified()){
      try {
        const res = await api.patch(`user/edit`, data);
        updateUser(res.data.user);
        setMessage({
          status: "good",
          text: "Changes saved successfully. Your profile has been updated.",
        });
      } catch (e) {
        setMessage({
          status: "bad",
          text: `Something went wrong:${e.message}`,
        });
      }
    }
  };

  return (
    <>
      {message && (
        <UpdateMessage message={message.text} status={message.status} />
      )}
      {}
      <section className="bg-white p-8 rounded-xl custom-shadow" id="Personal">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Personal Information
            </h2>
            <span className=" text-outline">
              <IdCard />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                First Name
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                type="text"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                Last Name
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                type="text"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  {" "}
                  <Phone />
                </span>
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl pl-12 pr-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                  type="tel"
                  {...register("phone")}
                />
                {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              className="px-8 py-3 bg-primary text-white rounded-xl font-label-md shadow-lg hover:bg-primary-container transition-all"
              disabled={!isDirty}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default PersonalInformation;
