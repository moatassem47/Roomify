import CheckoutForm from "../features/checkout/components/CheckoutForm"
import OrderSummary from "../features/checkout/components/OrderSummary"


const Checkout = () => {
    
  return (
    <div className="p-11 flex items-center gap-6 flex-col-reverse md:flex-row">
        <CheckoutForm/>
        <OrderSummary/>
    </div>
    )
}

export default Checkout