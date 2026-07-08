import { useNavigate } from "react-router-dom";
import OrderBadge from "./OrderBadge";


const OrderCard = ({ order }) => {
    const navigate=useNavigate()
    const status=order.status
  return (
    <article className={`bg-white rounded-xl tactile-shadow overflow-hidden border border-[#e6e2db]/30 flex flex-col transition-transform  duration-300 ${status==="Cancelled"?"opacity-50":`hover:scale-[1.01]`}`}>
      <div className="p-6 flex justify-between items-start border-b border-[#e6e2db]/20">
        <div className="flex flex-col">
          <span className=" font-bold text-brand-cedar">
            {order._id ? `#RF-${order._id.slice(-6).toUpperCase()}` : "N/A"}
          </span>
          <time className="text-brand-text text-sm" dateTime="2024-03-15">
            Placed on {order.createdAt.split("T")[0]}
          </time>
        </div>
        <OrderBadge status={status}/>
      </div>
      <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 flex-1">
        {order.items.map((item) => (
            <div className="shrink-0 relative">
              <div
                className="w-20 h-20 rounded-xl bg-cover bg-center"
                data-alt="A set of organic cotton cushions in muted sage and cream tones, piled elegantly on a light-colored linen sofa. The scene is cozy and inviting, with a focus on tactile comfort and soft textures that evoke a sense of calm and relaxation in a well-curated living space."
                style={{
                  backgroundImage: `url(${item.productId?.imageUrls[0]})`,
                }}
              ></div>
              <div className="mt-1 text-1 font-medium text-brand-charcoal truncate w-20">
                {item.productId.name}
              </div>
            </div>
        ))}
        </div>
      </div>
      <div className="px-6 py-3 bg-[#f8f3ec] flex flex-wrap justify-between items-center gap-6">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-outline">
              Items
            </span>
            <span className=" font-bold">{order.items.length} Products</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-outline">
              Total Price
            </span>
            <span className="text-label-md font-bold text-brand-cedar">
              {order.totalAmount} EG
            </span>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button className={status==="Cancelled"?"hidden":"px-6 py-2 rounded-lg bg-brand-cedar text-white  hover:shadow-lg transition-all active:opacity-90 cursor-pointer"}
          onClick={()=>navigate(`/orders/${order._id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default OrderCard;
