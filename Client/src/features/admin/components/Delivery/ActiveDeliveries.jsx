import React, { useState, useEffect } from 'react';
import api from '../../../../utils/axios';
import { Package, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const ActiveDeliveries = ({ personnel }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/admin/orders')
      .then(res => {
        setOrders(res.data.docs || []);
      })
      .catch(err => {
        console.error("Failed to fetch orders", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAssignOrder = async (orderId, deliveryPersonId) => {
    if (!deliveryPersonId) return;
    try {
      await api.patch(`/admin/orders/assign/${orderId}`, { deliveryPersonId });
      toast.success('Order assigned successfully');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to assign order');
      console.error(err);
    }
  };

  const activeOrders = orders.filter(o => o.status === 'Packed' || o.status === 'Out for Delivery');

  if (loading) return <div className="p-8 text-center text-brand-cedar">Loading orders...</div>;

  return (
    <div className="bg-[#FBF9F6] p-6 rounded-lg shadow-sm border border-brand-cedar/10">
      <h3 className="text-xl font-bold text-brand-cedar mb-4 flex items-center">
        <Package className="mr-2" />
        Ready & Active Deliveries
      </h3>
      
      {activeOrders.length === 0 ? (
        <div className="p-8 text-center text-brand-cedar/60 bg-white rounded border border-brand-cedar/10">
          No active or packed orders at the moment.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {activeOrders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded shadow border border-brand-cedar/20">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-brand-cedar">Order: {order._id.substring(0, 8)}...</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-sm text-brand-cedar/80 mb-4">
                <p>Address: {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              </div>

              {order.status === 'Packed' && (
                <div className="flex items-center space-x-2 border-t border-brand-cedar/10 pt-3 mt-2">
                  <Truck size={16} className="text-brand-cedar/60" />
                  <select
                    className="flex-1 px-2 py-1 text-sm bg-[#FBF9F6] border border-brand-cedar/30 rounded focus:outline-none focus:border-brand-cedar"
                    defaultValue=""
                    onChange={(e) => handleAssignOrder(order._id, e.target.value)}
                  >
                    <option value="" disabled>Assign Delivery Person</option>
                    {personnel.filter(p => p.isActive).map(p => (
                      <option key={p._id} value={p._id}>
                        {p.firstName} {p.lastName} - {p.deliveryDetails?.vehicleType}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {order.status === 'Out for Delivery' && (
                <div className="mt-2 pt-3 border-t border-brand-cedar/10 text-sm text-brand-cedar flex items-center">
                  <Truck size={16} className="text-blue-600 mr-2" />
                  Assigned to: <span className="font-semibold ml-1">
                    {personnel.find(p => p._id === order.deliveryPersonId)?.firstName || 'Unknown'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveDeliveries;
