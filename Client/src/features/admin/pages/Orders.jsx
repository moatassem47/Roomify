import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '../apis/useAdmin';
import { Loader2, Search, Calendar, ChevronLeft, ChevronRight, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data, isLoading, isError, error } = useOrders({ page, limit: 10, status: statusFilter });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const handleStatusChange = (orderId, newStatus) => {
    updateStatus(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => toast.success('Order status updated successfully'),
        onError: (err) => toast.error(err?.message || 'Failed to update status'),
      }
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Package size={14} /> Placed</span>;
      case 'Packed': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Package size={14} /> Packed</span>;
      case 'Out for Delivery': return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><Truck size={14} /> Out for Delivery</span>;
      case 'Delivered': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><CheckCircle size={14} /> Delivered</span>;
      case 'Cancelled': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit"><XCircle size={14} /> Cancelled</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium w-fit">{status}</span>;
    }
  };

  if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#8D6E63] w-8 h-8" /></div>;
  if (isError) return <div className="text-red-500 text-center mt-10">Error loading orders: {error?.message}</div>;

  const orders = data?.docs || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6 bg-[#FAF8F5] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#3E2723]">Orders Management</h1>
          <p className="text-gray-500 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#E6E0D8] overflow-hidden">
        {/* Filters and Header */}
        <div className="p-4 border-b border-[#E6E0D8] flex justify-between items-center bg-[#FDFBF9]">
          <div className="flex gap-4 items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-[#E6E0D8] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63] text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Packed">Packed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Total Orders: {data?.totalDocs || 0}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-gray-600 font-semibold border-b border-[#E6E0D8]">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0D8]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#FDFBF9] transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{order.userId?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{order.userId?.email || ''}</div>
                      <div className="text-xs text-gray-400 mt-1">{order.shippingAddress?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-gray-600 border border-gray-200 bg-gray-50 rounded px-2 py-0.5 w-fit">
                          {order.paymentMethod}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded w-fit ${
                          order.paymentStatus === 'Completed' ? 'bg-green-50 text-green-600' :
                          order.paymentStatus === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={isUpdating}
                        className="bg-white border border-[#E6E0D8] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8D6E63] text-gray-700 shadow-sm disabled:opacity-50 cursor-pointer hover:border-[#8D6E63] transition-colors"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#E6E0D8] flex items-center justify-between bg-[#FAF8F5]">
            <div className="text-sm text-gray-500">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[#E6E0D8] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[#E6E0D8] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;