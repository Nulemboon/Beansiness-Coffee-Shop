import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './DeliveryForm.css';

const DeliveryForm = () => {
  const location = useLocation();
  const { amount, voucherCode } = location.state || { amount: 0, voucherCode: '' };
  const { url } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    amount: amount, 
    content: `Order with voucher code: ${voucherCode}`, 
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      amount: amount,
      content: `Order with voucher code: ${voucherCode}`,
    }));
  }, [amount, voucherCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentData = {
      amount: formData.amount,
      content: formData.content,
    };
  
    axios.post(`${url}/transaction/create_payment_url`, paymentData)
      .then(response => {
        if (response.data && response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        } else {
          console.error('Invalid response format:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error creating the payment URL:', error);
      });
  };
  

  return (
    <div className="delivery-form-container">
      <h1 className="delivery-form-title">Delivery Information</h1>
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (VND)</label>
          <input 
            type="number" 
            id="amount" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
            readOnly 
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea 
            id="content" 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default DeliveryForm;
