
import BreadCrumpStep from "./BreadCrumpStep";
const OrderBreadCrump = ({ statusHistory }) => {

  const formattedData = statusHistory?.map((status) => ({
    ...status,
    date: new Date(status.date).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));
  
  console.log(statusHistory)

  const steps = [
  {
    key: "Placed",
    label: "Order Placed",
  },
  {
    key: "Packed",
    label: "Packed & Quality Checked",
  },
  {
    key: "Out for Delivery",
    label: "Shipped",
  },
  {
    key: "Delivered",
    label: "Delivered",
  },
];

const currentStatus =formattedData[formattedData.length - 1]?.status;


 const statusMap = new Map(
  formattedData.map((status) => [status.status, status])
);
 
const isCancelled=statusMap.has("Cancelled")

  return (
    <div className="bg-surface-container-lowest p-lg rounded-xl ambient-shadow">
      <h3 className="font-label-md text-body-lg mb-lg">Order Status</h3>
      {isCancelled?<div className="flex items-center justify-center">
        <h1 className="text-headline-md text-error">Order Cancelled</h1>
      </div>:<div className="space-y-0">
            {steps.map((step) => (
                <BreadCrumpStep key={step.key} date={statusMap.get(step.key)?.date}
                title={step.label}
                completed={statusMap.has(step.key)}
                isCurrent={currentStatus===step.key}/>
            ))}
      </div>}
    </div>
    
  );
};

export default OrderBreadCrump;

