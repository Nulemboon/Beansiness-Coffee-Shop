import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Cart = () => {
  const { removeFromCart, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');
  const [cart, setCart] = useState([]);
  const [cookies, setCookie] = useCookies(['cart']);

  useEffect(() => {
    const currentCart = cookies.cart || [];
    setCart(currentCart);
  }, [cookies.cart]);

  const handleRemoveFromCart = (itemIndex) => {
    const updatedCart = cart.filter((_, index) => index !== itemIndex);
    setCart(updatedCart);
    setCookie('cart', updatedCart, { path: '/' });
    if (cart[itemIndex]) {
      removeFromCart(cart[itemIndex]._id);
    }
  };

  const handleCheckout = () => {
    if (getTotalCartAmount() > 0) {
      navigate('/delivery_form', { state: { voucherCode } });
    } else {
      alert('Your cart is empty!');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const toppingCost = item.toppings.reduce((sum, toppingName) => {
        const topping = item.toppings.find(t => t.name === toppingName);
        return sum + (topping ? topping.price : 0);
      }, 0);
      return total + (item.price + toppingCost) * item.quantity;
    }, 0);
  };

  if (!cart.length) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Title</p>
          <p>Size</p>
          <p>Toppings</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cart.map((item, index) => (
          <div key={index}>
            <div className="cart-items-title cart-items-item">
              <p>{item.name}</p> 
              <p>{item.size}</p>
              <p>{item.toppings.join(', ')}</p> 
              <p>{item.price + ' VND'}</p>
              <div>{item.quantity}</div>
              <p>{(item.price * item.quantity) + ' VND'}</p>
              <p className='cart-items-remove-icon' onClick={() => handleRemoveFromCart(index)}>x</p>
            </div>
            <hr />
          </div>
        ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 style={{ color: '#8B4513' }}>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>{getTotalPrice() + ' VND'}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>{getTotalPrice() === 0 ? 0 : 5000 + ' VND'}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>{(getTotalPrice() === 0 ? 0 : getTotalPrice() + 5000) + ' VND'}</b></div>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a voucher code, enter it here</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='Promo code' 
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
