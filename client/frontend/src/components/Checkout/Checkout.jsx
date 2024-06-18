import React from 'react';
import { useLocation } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const { voucherCode, cartItems } = location.state || {};

  const calculateTotal = () => {
    if (!cartItems) return 0;
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 5 : 0;
    return subtotal + deliveryFee;
  };

  return (
    <div className='checkout'>
      <h1>Checkout</h1>
      <div className='checkout-details'>
        <div className='checkout-items'>
          <h2>Order Summary</h2>
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className='checkout-item'>
                <p><strong>Title:</strong> {item.name}</p>
                <p><strong>Topping:</strong> {item.topping}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total:</strong> ${item.price * item.quantity}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>
        <div className='checkout-summary'>
          <h2>Order Summary</h2>
          <div className='checkout-summary-details'>
            <p><strong>Subtotal:</strong> ${calculateTotal() - 5}</p>
            <p><strong>Delivery Fee:</strong> ${calculateTotal() === 0 ? 0 : 5}</p>
            <p><strong>Total:</strong> ${calculateTotal()}</p>
          </div>
          <div className='checkout-voucher'>
            <h2>Voucher Code</h2>
            <p>{voucherCode || 'No voucher code applied.'}</p>
          </div>
          <button onClick={() => alert('Order confirmed!')}>Confirm Order</button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
