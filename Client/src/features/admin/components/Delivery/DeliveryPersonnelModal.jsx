import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const DeliveryPersonnelModal = ({ isOpen, onClose, onSubmit, personnelToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (personnelToEdit) {
        reset({
          firstName: personnelToEdit.firstName,
          lastName: personnelToEdit.lastName,
          email: personnelToEdit.email,
          phone: personnelToEdit.phone,
          city: personnelToEdit.address?.city,
          streetAddress: personnelToEdit.address?.streetAddress,
          vehicleType: personnelToEdit.deliveryDetails?.vehicleType,
          licensePlate: personnelToEdit.deliveryDetails?.licensePlate,
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          city: '',
          streetAddress: '',
          vehicleType: '',
          licensePlate: '',
        });
      }
    }
  }, [isOpen, personnelToEdit, reset]);

  const submitForm = (data) => {
    const formattedData = {
      ...data,
      address: {
        city: data.city,
        streetAddress: data.streetAddress,
      }
    };
    onSubmit(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-brand-creamy w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto border border-brand-cedar/20">
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-brand-cedar/20 bg-[#FBF9F6]">
          <h2 className="text-2xl font-bold text-brand-cedar">
            {personnelToEdit ? 'Edit Delivery Person' : 'Add Delivery Person'}
          </h2>
          <button onClick={onClose} className="p-2 text-brand-cedar hover:bg-brand-cedar/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-cedar border-b border-brand-cedar/10 pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">First Name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">Last Name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">Email</label>
                <input
                  type="email"
                  disabled={!!personnelToEdit}
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar disabled:bg-gray-100 disabled:text-gray-500"
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>
              {!personnelToEdit && (
                <div>
                  <label className="block text-sm font-medium text-brand-cedar mb-1">Password</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                    className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                  />
                  {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">Phone (01xxxxxxxxx)</label>
                <input
                  {...register('phone', { required: 'Phone is required', pattern: { value: /^01[0-9]{9}$/, message: 'Invalid phone format' } })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-cedar border-b border-brand-cedar/10 pb-2">Delivery & Address Details</h3>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">Vehicle Type</label>
                <input
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  placeholder="e.g. Motorcycle, Van"
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.vehicleType && <span className="text-red-500 text-xs">{errors.vehicleType.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">License Plate</label>
                <input
                  {...register('licensePlate', { required: 'License plate is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.licensePlate && <span className="text-red-500 text-xs">{errors.licensePlate.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">City</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-cedar mb-1">Street Address</label>
                <input
                  {...register('streetAddress', { required: 'Street address is required' })}
                  className="w-full px-3 py-2 bg-white border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar text-brand-cedar"
                />
                {errors.streetAddress && <span className="text-red-500 text-xs">{errors.streetAddress.message}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-cedar/20 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded text-brand-cedar bg-brand-cedar/10 hover:bg-brand-cedar/20 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-brand-cedar text-[#FBF9F6] hover:bg-opacity-90 transition-colors shadow cursor-pointer"
            >
              {personnelToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryPersonnelModal;
