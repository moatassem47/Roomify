
import { Edit2, ToggleLeft, ToggleRight, History } from 'lucide-react';

const DeliveryPersonnelTable = ({
  personnel,
  onEdit,
  onToggleStatus,
  onViewHistory,
}) => {
  return (
    <div className="overflow-x-auto bg-[#FBF9F6] rounded-lg shadow-sm border border-brand-cedar/10">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-brand-cedar text-[#FBF9F6]">
            <th className="p-4 border-b border-brand-cedar/20 font-semibold">Name</th>
            <th className="p-4 border-b border-brand-cedar/20 font-semibold">Contact</th>
            <th className="p-4 border-b border-brand-cedar/20 font-semibold">Vehicle</th>
            <th className="p-4 border-b border-brand-cedar/20 font-semibold">Status</th>
            <th className="p-4 border-b border-brand-cedar/20 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {personnel.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-8 text-center text-brand-cedar/60">
                No delivery personnel found.
              </td>
            </tr>
          ) : (
            personnel.map((person) => {
              const isActive = person.isActive !== false;

              return (
              <tr key={person._id} className="hover:bg-brand-cedar/5 border-b border-brand-cedar/10 transition-colors text-brand-cedar">
                <td className="p-4">
                  <div className="font-medium">{person.firstName} {person.lastName}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{person.email}</div>
                  <div className="text-sm text-brand-cedar/70">{person.phone}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{person.deliveryDetails?.vehicleType}</div>
                  <div className="text-sm text-brand-cedar/70">{person.deliveryDetails?.licensePlate}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => onEdit(person)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                      title="Edit Details"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(person._id, !isActive)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isActive
                          ? 'text-red-600 hover:bg-red-100'
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={isActive ? 'Deactivate' : 'Activate'}
                    >
                      {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => onViewHistory(person)}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                      title="View History"
                    >
                      <History size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryPersonnelTable;
