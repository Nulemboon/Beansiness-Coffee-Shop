import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');

  // Mock data for illustration
  const mockCartItems = [
    { id: 1, name: "Pizza", topping: "Pepperoni", price: 10, quantity: cartItems[1] || 2},
    { id: 2, name: "Burger", topping: "Cheese", price: 8, quantity: cartItems[2] ||2 }
  ];

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Title</p> 
          <p>Topping</p> 
          <p>Price</p> 
          <p>Quantity</p> 
          <p>Total</p> 
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {mockCartItems.map((item, index) => (
          <div key={index}>
            <div className="cart-items-title cart-items-item">
              <p>{item.name}</p>
              <p>{item.topping}</p> {/* Display topping */}
              <p>${item.price}</p>
              <div>{item.quantity}</div>
              <p>${item.price * item.quantity}</p>
              <p className='cart-items-remove-icon' onClick={() => removeFromCart(item.id)}>x</p>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 style={{ color: '#8B4513' }}>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>${getTotalCartAmount()}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? 0 : 5}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b></div>
          </div>
          <button onClick={() => navigate('/checkout', { state: { voucherCode } })}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a voucher code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='promo code' 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
