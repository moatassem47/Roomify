import { useNavigate, useParams } from "react-router-dom";
import useFetchQuery from "../hooks/useFetchQuery";
import Loading from "../components/Loading";
import Erorr from "../components/Error";
import {  ChevronLeft } from "lucide-react";
import OrderBadge from "../features/orders/OrderBadge";
import OrderBreadCrump from "../features/orders/OrderBreadCrump";
import { useState } from "react";
import CancelPopUp from "../components/CancelPopUp";
import { useQueryClient } from "@tanstack/react-query";
import api from "../utils/axios";
import toast from "react-hot-toast";
const OrderDetails = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const [openPopUp,setOpenPopUp]=useState(false)
  const queryClient =useQueryClient()
  const {
    data: order,
    isLoading,
    error,
  } = useFetchQuery(`/order/${id}`, ["orders", id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Erorr error={error} />;
  }
  if (!order || order.length === 0) {
    <div className="flex justify-center items-center text-2xl text-primary text-headline-sm">
      there's no data to show
    </div>;
  }
  console.log(order);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleClick=async()=>{
        try{
            const res=await api.patch(`order/cancel/${id}`)
            setOpenPopUp(false)
             toast.success(res.data.message, {
                duration:2000,
                position:"bottom-center",
                style: {
                    border: '1px solid #713200',
                    padding: '16px',
                    color: '#713200',
                },
                iconTheme: {
                    primary: '#713200',
                    secondary: '#FFFAEE',
                }})
        queryClient.invalidateQueries({
                queryKey:["orders", id]})
        }catch(e){
           toast.error(e.message||e.response?.data )
        }
    }
  return (
    <div className="max-w-7xl mx-auto px-gutter py-xl">
      <div className="mb-lg">
        <button className="flex items-center text-primary font-label-md hover:opacity-80 transition-all">
          <ChevronLeft />
          Back to Orders
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        <div className="lg:col-span-8 space-y-lg">
          <div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow">
            <div className="flex flex-wrap justify-between items-center gap-md mb-md">
              <div>
                <h1 className="font-headline-md text-headline-md mb-xs">
                  Order{" "}
                  {order._id
                    ? `#RF-${order._id.slice(-6).toUpperCase()}`
                    : "N/A"}
                </h1>
                <p className="text-on-surface-variant font-body-md">
                  Placed on {formattedDate}
                </p>
              </div>
              <OrderBadge status={order.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-md border-t border-surface-variant">
              <div>
                <p className="font-label-md text-on-surface-variant mb-xs">
                  Shipping Address
                </p>
                <p className="text-body-md">
                  {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.postalCode}
                </p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant mb-xs">
                  Payment Method
                </p>
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-xs text-on-surface-variant text-body-md">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow">
            <h2 className="font-headline-sm text-headline-sm mb-lg">
              Your Selection
            </h2>
            <div className="space-y-lg">
              {order.items.map((item) => (
                <div className="flex items-center gap-md" key={item.productId._id}>
                  <img
                    className="w-32 h-32 object-cover rounded-xl bg-surface-container"
                    data-alt={item.productId.name}
                    src={item.productId.imageUrls[1]}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-label-md text-body-lg">
                          {item.productId.name}
                        </h3>
                      </div>
                      <p className="font-headline-sm text-primary">{item.unitPrice} EGP</p>
                    </div>
                    <div className="mt-sm flex items-center justify-between">
                      <span className="bg-secondary/10 text-secondary font-label-md px-sm py-xs rounded-full">
                        Qty: {item.quantity}
                      </span>
                      <button className="text-primary hover:underline font-label-md"
                      onClick={()=>navigate(`/product/${item.productId._id}`)}>
                        Review Item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-md justify-end">
           
            {order.status==="Packed"||order.status==="Placed"&&<button className="px-lg py-md bg-primary text-on-primary font-label-md rounded-xl hover:opacity-90 shadow-md transition-all"
            onClick={()=>setOpenPopUp(true)}>
              Cancel Entire Order
            </button>}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-lg sticky top-25">
          <div className="bg-surface-container-high p-lg rounded-xl">
            <h3 className="font-headline-sm text-headline-sm mb-md">
              Order Summary
            </h3>
            <div className="space-y-sm">
              <div className="flex justify-between text-body-md">
                <span>Subtotal</span>
                <span>{order.totalAmount} E£</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span>Shipping</span>
                <span className="text-secondary font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-body-md">
                <span>Tax</span>
                <span>0 E£</span>
              </div>
              <div className="flex justify-between text-body-md border-b border-outline-variant pb-sm">
                <span>Discount (WELCOME20)</span>
                <span className="text-primary">-00.00 E£</span>
              </div>
              <div className="flex justify-between font-headline-sm text-headline-sm pt-sm">
                <span>Total</span>
                <span>{order.totalAmount} E£</span>
              </div>
            </div>
          </div>

          <OrderBreadCrump statusHistory={order.statusHistory}/>
          
        </div>
      </div>
      {openPopUp&&<CancelPopUp  setOpenPopUp={setOpenPopUp} handleClick={handleClick} acceptMessage="Cancel Order"
      refuseMessage="Keep Order" message="Are you sure you want to cancel this order? This action cannot be
          undone." title="Cancel Order?" />}
    </div>
  );
};

export default OrderDetails;
