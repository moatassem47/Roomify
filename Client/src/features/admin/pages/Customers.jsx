import { 
  Loader2, Mail, Phone, MapPin, 
  Package, CreditCard, Calendar, CheckCircle, 
  XCircle, ChevronDown, User, Shield, Activity,
  Ban, Clock, Search
} from "lucide-react";
import { useCustomers } from "../apis/useAdmin";

const formatDate = (date) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-US", {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const formatMoney = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'delivered':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'pending':
    case 'processing':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const Customers = () => {
  const { data, isLoading, isError, error } = useCustomers();
  const customers = data?.customers || [];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-t-4 border-b-4 border-primary/20 animate-spin"></div>
          <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Customers</h3>
        <p className="text-red-600/80">{error?.message || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream/50 via-white to-brand-cream/30 p-4 md:p-8">
      {/* Header Section */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-white border border-brand-surface-container shadow-sm p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-charcoal to-gray-600 tracking-tight">
              Customers Directory
            </h1>
            <p className="mt-2 text-brand-text/80 flex items-center gap-2">
              <User className="h-4 w-4" />
              Manage your customer base, view their orders, and analyze their lifetime value.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-brand-cream/50 px-4 py-2 rounded-2xl border border-brand-surface-container">
            <div className="text-right">
              <p className="text-sm text-brand-text/70 font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-brand-charcoal leading-none">{customers.length}</p>
            </div>
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm ml-2">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-6">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No Customers Found</h3>
            <p className="text-gray-500 mt-2 max-w-md text-center">There are currently no customers registered in the system. They will appear here once they sign up.</p>
          </div>
        ) : (
          customers.map((customer, index) => {
            const orders = customer.orders || [];
            const totalSpent = orders.reduce((sum, order) => {
              return order.paymentStatus === "Completed"
                ? sum + Number(order.totalAmount || 0)
                : sum;
            }, 0);
            
            const initials = [customer.firstName, customer.lastName]
              .filter(Boolean)
              .map(n => n[0])
              .join("")
              .toUpperCase() || "?";

            return (
              <details
                key={customer._id}
                className="group relative overflow-hidden rounded-2xl border border-brand-surface-container bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:bg-white [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="grid cursor-pointer gap-6 px-6 py-5 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] md:items-center relative z-10 transition-colors group-hover:bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-primary/40 text-lg font-bold text-white shadow-inner">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="avatar" className="h-full w-full rounded-2xl object-cover" />
                      ) : (
                        initials
                      )}
                      {customer.isVerified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 fill-green-100" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-brand-charcoal transition-colors group-hover:text-primary">
                        {[customer.firstName, customer.lastName].filter(Boolean).join(" ") || "Unknown User"}
                      </h2>
                      <p className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mt-1">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {customer.phone || <span className="italic text-gray-400">No phone</span>}
                    </p>
                    <p className="flex items-start gap-2 line-clamp-1">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>
                        {[customer.address?.streetAddress, customer.address?.city]
                          .filter(Boolean)
                          .join(", ") || <span className="italic text-gray-400">No address provided</span>}
                      </span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center rounded-xl bg-gray-50/80 p-3 border border-gray-100/50 transition-colors group-hover:bg-white group-hover:border-gray-200 group-hover:shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Orders
                    </p>
                    <p className="text-xl font-bold text-brand-charcoal">{orders.length}</p>
                  </div>
                  
                  <div className="flex flex-col justify-center rounded-xl bg-primary/5 p-3 border border-primary/10 transition-colors group-hover:bg-primary/10 group-hover:border-primary/20">
                    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" /> Spent
                    </p>
                    <p className="text-xl font-bold text-primary">{formatMoney(totalSpent)}</p>
                  </div>
                  
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-transform duration-300 group-open:rotate-180 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm self-center">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </summary>

                {/* Expanded Details Section */}
                <div className="border-t border-brand-surface-container bg-gray-50/30 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
                  <div className="mb-8 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                    {/* User Info Cards */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-start gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shield className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Account Status</p>
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 font-medium"><span className={`h-2 w-2 rounded-full ${customer.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span> {customer.isActive ? 'Active' : 'Inactive'}</span>
                          <span className="text-gray-600">Role: <span className="font-semibold capitalize">{customer.role}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-start gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Clock className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Timeline</p>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600">Joined: <span className="font-semibold">{formatDate(customer.createdAt)}</span></span>
                          <span className="text-gray-600">Updated: <span className="font-semibold">{formatDate(customer.updatedAt)}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-start gap-3">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Activity className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Activity Highlights</p>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600">Provider: <span className="font-semibold capitalize">{customer.providers?.join(", ") || "Email"}</span></span>
                          <span className="text-gray-600">Wishlist Items: <span className="font-semibold">{customer.wishlist?.length || 0}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-start gap-3">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Ban className="h-5 w-5" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Restrictions</p>
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-600">Deleted: <span className={customer.isDeleted ? "font-semibold text-red-600" : "font-semibold"}>{customer.isDeleted ? "Yes" : "No"}</span></span>
                          <span className="text-gray-600 font-mono text-xs mt-1 truncate max-w-[140px]" title={customer._id}>ID: {customer._id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-brand-surface-container bg-white shadow-sm">
                    <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3">
                      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Package className="h-4 w-4" /> Order History
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
                          <tr>
                            <th className="px-5 py-3.5 whitespace-nowrap">Order ID</th>
                            <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
                            <th className="px-5 py-3.5">Items</th>
                            <th className="px-5 py-3.5 whitespace-nowrap">Amount</th>
                            <th className="px-5 py-3.5 whitespace-nowrap">Payment</th>
                            <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="px-5 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                  <Package className="h-10 w-10 mb-3 text-gray-300" />
                                  <p>No orders placed yet.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            orders.map((order) => (
                              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group/row">
                                <td className="px-5 py-4">
                                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-mono font-medium text-gray-600 border border-gray-200 group-hover/row:border-gray-300 transition-colors">
                                    #{order._id.slice(-6).toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="px-5 py-4 min-w-[200px]">
                                  <div className="flex flex-col gap-1.5">
                                    {(order.items || []).map((item, index) => (
                                      <div key={`${order._id}-${index}`} className="flex items-center gap-2 text-gray-700">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0"></div>
                                        <span className="font-medium line-clamp-1">{item.productId?.name || "Product"}</span>
                                        <span className="text-gray-400 text-xs shrink-0">x{item.quantity}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-5 py-4 font-bold text-brand-charcoal whitespace-nowrap">
                                  {formatMoney(order.totalAmount)}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-gray-600 capitalize text-xs font-medium flex items-center gap-1">
                                      <CreditCard className="h-3 w-3" /> {order.paymentMethod}
                                    </span>
                                    <span className={`inline-flex items-center w-fit rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusColor(order.paymentStatus)}`}>
                                      {order.paymentStatus}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </details>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Customers;
