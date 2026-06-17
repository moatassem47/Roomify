import CartItems from "../features/cart/components/CartItems"
import Summary from "../features/cart/components/Summary"


const Cart = () => {
  return (
    <div className="px-4 py-15  ">
        <div className="grid grid-cols-12 gap-5 ">
            <CartItems/>
            <Summary/>
        </div>
    </div>
  )
}

export default Cart