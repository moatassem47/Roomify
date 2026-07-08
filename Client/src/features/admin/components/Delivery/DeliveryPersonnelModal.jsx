import  { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const DeliveryPersonnelModal = ({ isOpen, onClose, onSubmit, personnelToEdit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const inputClass = "w-full h-11 rounded-lg border border-brand-cedar/20 bg-white px-3 text-sm text-brand-charcoal outline-none transition focus:border-brand-cedar focus:ring-2 focus:ring-brand-cedar/15 disabled:bg-brand-surface-container disabled:text-brand-text/60";
  const labelClass = "block text-sm font-semibold text-brand-cedar mb-1.5";
  const errorClass = "mt-1 block text-xs font-medium text-brand-error";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-lg border border-brand-cedar/15 bg-brand-cream shadow-ambient">
        <div className="flex items-start justify-between gap-4 border-b border-brand-cedar/10 bg-white px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-sage">Delivery personnel</p>
            <h2 className="mt-1 text-2xl font-bold text-brand-cedar">
              {personnelToEdit ? 'Edit Delivery Person' : 'Create Delivery Person'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-brand-cedar transition-colors hover:bg-brand-cedar/10"
            aria-label="Close delivery personnel form"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="max-h-[75vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-4">
              <h3 className="border-b border-brand-cedar/10 pb-2 text-base font-semibold text-brand-charcoal">Personal Information</h3>
              <div>
                <label className={labelClass}>First Name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className={inputClass}
                />
                {errors.firstName && <span className={errorClass}>{errors.firstName.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className={inputClass}
                />
                {errors.lastName && <span className={errorClass}>{errors.lastName.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  disabled={!!personnelToEdit}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                  })}
                  className={inputClass}
                />
                {errors.email && <span className={errorClass}>{errors.email.message}</span>}
              </div>
              {!personnelToEdit && (
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                    className={inputClass}
                  />
                  {errors.password && <span className={errorClass}>{errors.password.message}</span>}
                </div>
              )}
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  {...register('phone', {
                    required: 'Phone is required',
                    pattern: { value: /^(01\d{9}|\+20\s?0?1\d{9})$/, message: 'Invalid phone format' },
                  })}
                  placeholder="01xxxxxxxxx"
                  className={inputClass}
                />
                {errors.phone && <span className={errorClass}>{errors.phone.message}</span>}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="border-b border-brand-cedar/10 pb-2 text-base font-semibold text-brand-charcoal">Delivery & Address Details</h3>
              <div>
                <label className={labelClass}>Vehicle Type</label>
                <input
                  {...register('vehicleType', { required: 'Vehicle type is required' })}
                  placeholder="e.g. Motorcycle, Van"
                  className={inputClass}
                />
                {errors.vehicleType && <span className={errorClass}>{errors.vehicleType.message}</span>}
              </div>
              <div>
                <label className={labelClass}>License Plate</label>
                <input
                  {...register('licensePlate', { required: 'License plate is required' })}
                  className={inputClass}
                />
                {errors.licensePlate && <span className={errorClass}>{errors.licensePlate.message}</span>}
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className={inputClass}
                />
                {errors.city && <span className={errorClass}>{errors.city.message}</span>}
              </div>
              <div>
                <label className={labelClass}>Street Address</label>
                <input
                  {...register('streetAddress', { required: 'Street address is required' })}
                  className={inputClass}
                />
                {errors.streetAddress && <span className={errorClass}>{errors.streetAddress.message}</span>}
              </div>
            </section>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-brand-cedar/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand-cedar/20 px-5 py-2.5 text-sm font-semibold text-brand-cedar transition-colors hover:bg-brand-cedar/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-cedar px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-cedar-hover"
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
