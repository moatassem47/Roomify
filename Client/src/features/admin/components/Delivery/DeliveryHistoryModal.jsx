import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import api from '../../../../utils/axios';

const DeliveryHistoryModal = ({ isOpen, onClose, personnel }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && personnel) {
      setLoading(true);
      api.get(`/admin/delivery/${personnel._id}/history`)
        .then(res => {
          setHistory(res.data.data || []);
        })
        .catch(err => {
          console.error("Failed to fetch history", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, personnel]);

  if (!isOpen || !personnel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-brand-creamy w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col border border-brand-cedar/20">
        <div className="flex justify-between items-center p-6 border-b border-brand-cedar/20 bg-[#FBF9F6]">
          <h2 className="text-2xl font-bold text-brand-cedar">
            Delivery History: {personnel.firstName} {personnel.lastName}
          </h2>
          <button onClick={onClose} className="p-2 text-brand-cedar hover:bg-brand-cedar/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="flex justify-center p-8 text-brand-cedar">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center p-8 text-brand-cedar/60">No delivery history found for this person.</div>
          ) : (
            <div className="space-y-4">
              {history.map(order => (
                <div key={order._id} className="border border-brand-cedar/20 rounded p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-brand-cedar">Order ID:</span> {order._id}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-brand-cedar/80">
                    <p><span className="font-medium">Total Amount:</span> ${order.totalAmount}</p>
                    <p><span className="font-medium">Assigned on:</span> {new Date(order.updatedAt).toLocaleDateString()}</p>
                    {order.deliveredAt && (
                      <p><span className="font-medium">Delivered at:</span> {new Date(order.deliveredAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistoryModal;
