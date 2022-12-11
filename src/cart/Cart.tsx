import CartItem from "../cartItem/CartItem";
// Styles
import { Wrapper } from "./Cart.styles";
// Types
import { CartItemType } from "../App";

type Props = {
    cartItems: CartItemType[],
    addToCart: (clickedItem: CartItemType) => void,
    removeFromCart: (id: number) => void
}

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotal = (items: CartItemType[]) => {
        return items.reduce((accumulator, item) => {
            return accumulator + (item.price * item.amount)
        }, 0)
    }
    return (
        <Wrapper>
            <div className="information">
                {cartItems.length === 0 ? <p>No item in the cart</p> : null}
                {cartItems.map((item) => (
                    <CartItem 
                        key={item.id}
                        item={item}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                    />
                ))}
                {cartItems.length > 0 ? <p>Total: ${calculateTotal(cartItems).toFixed(2)}</p> : ""}
            </div>
        </Wrapper>
    )
}

export default Cart
