import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Title</p>
          <p>Size</p>
          <p>Topping</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {Object.keys(cartItems).map((itemId, index) => (
          <div key={index}>
            <div className="cart-items-title cart-items-item">
              {/* Assuming you have a function to get item details by ID */}
              <p>{cartItems[itemId].name}</p>
              <p>{cartItems[itemId].size}</p>
              <p>{cartItems[itemId].topping}</p>
              <p>${cartItems[itemId].price}</p>
              <div>{cartItems[itemId].quantity}</div>
              <p>${cartItems[itemId].price * cartItems[itemId].quantity}</p>
              <p className='cart-items-remove-icon' onClick={() => removeFromCart(itemId)}>x</p>
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
          <button onClick={() => navigate('/delivery_form', { state: { voucherCode } })}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a voucher code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='promo code' 
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
