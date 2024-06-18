import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, loadCartData, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    async function fetchCartData() {
      await loadCartData(); 
    }
    fetchCartData();
  }, [loadCartData]);

  useEffect(() => {
    async function fetchCartDetails() {
      try {
        const response = await axios.get(`${url}/cart`);
        setCartDetails(response.data.cartItems); 
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    }
    fetchCartDetails();
  }, [url, cartItems]);

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
        {cartDetails.map((item, index) => (
          <div key={index}>
            <div className="cart-items-title cart-items-item">
              <p>{item.name}</p>
              <p>{item.topping}</p>
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
