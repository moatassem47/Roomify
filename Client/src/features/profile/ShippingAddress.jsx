import { Map } from "lucide-react";
import { useState } from "react";
import z from "zod";
import useAuth from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../utils/axios";
import UpdateMessage from "../../components/common/UpdateMessage";

const AddressSchema = z.object({
  address: z.object({
    streetAddress: z
      .string()
      .min(8, "streetAddress must be at least 8 characters"),
    city: z.string().min(3, "city must be at least 3 characters"),
  }),
});

const ShippingAddress = ({ streetAddress, city }) => {
  const [message, setMessage] = useState(null);
  const { updateUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      address: {
        city: city,
        streetAddress: streetAddress,
      },
    },
    resolver: zodResolver(AddressSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.patch(`user/edit`, data);
      updateUser(res.data.user);
      setMessage({
        status: "good",
        text: "Changes saved successfully. Your Address has been updated.",
      });
    } catch (e) {
      setMessage({
        status: "bad",
        text: `Something went wrong:${e.message}`,
      });
    }
  };
  return (
    <>
      {message && (
        <UpdateMessage message={message.text} status={message.status} />
      )}
      <section className="bg-white p-8 rounded-xl custom-shadow" id="Address">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Shipping Address
            </h2>
            <span className=" text-outline">
              <Map />
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3 space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                Street Address
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                type="text"
                {...register("address.streetAddress")}
              />
              {errors.address?.streetAddress && (
                <p className="text-red-500">
                  {errors.address.streetAddress.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-label-md text-on-surface-variant ml-1">
                City
              </label>
              <input
                className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 input-inset focus:ring-2 focus:ring-primary text-on-surface"
                type="text"
                {...register("address.city")}
              />
              {errors.address?.city && (
                <p className="text-red-500">{errors.address.city.message}</p>
              )}
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
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

export default ShippingAddress;
