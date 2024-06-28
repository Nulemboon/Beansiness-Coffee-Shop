import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './DeliveryForm.css';

const DeliveryForm = () => {
  const location = useLocation();
  const { amount, voucherCode } = location.state || { amount: 0, voucherCode: '' };
  const { url, customerId } = useContext(StoreContext); // Assuming customerId is available in StoreContext

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    amount: amount,
    content: `Order with voucher code: ${voucherCode}`,
  });

  const [deliveryInfo, setDeliveryInfo] = useState([]);
  const [selectedDeliveryInfo, setSelectedDeliveryInfo] = useState(null);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      amount: amount,
      content: `Order with voucher code: ${voucherCode}`,
    }));
  }, [amount, voucherCode]);

  useEffect(() => {
    axios.get(`${url}/account/667d2308971469fa2b8b95bb`)
      .then(response => {
        if (response.data && response.data.delivery_info) {
          setDeliveryInfo(response.data.delivery_info);
        } else {
          console.error('Invalid response format:', response.data);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the customer data:', error);
      });
  }, [customerId, url]);

  const handleSelectDeliveryInfo = (info) => {
    setSelectedDeliveryInfo(info);
    setFormData({
      ...formData,
      name: info.receiver_name,
      phone: info.phone_number,
      address: info.address,
    });
  };

  const handleDeleteDeliveryInfo = (id) => {
    axios.delete(`${url}/deliveryInfo/${id}`)
      .then(response => {
        setDeliveryInfo(deliveryInfo.filter(info => info._id !== id));
        if (selectedDeliveryInfo && selectedDeliveryInfo._id === id) {
          setSelectedDeliveryInfo(null);
          setFormData({
            name: '',
            phone: '',
            address: '',
            amount: amount,
            content: `Order with voucher code: ${voucherCode}`,
          });
        }
      })
      .catch(error => {
        console.error('There was an error deleting the delivery info:', error);
      });
  };

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

    const newDeliveryInfo = {
      receiver_name: formData.name,
      phone_number: formData.phone,
      address: formData.address,
    };

    if (!selectedDeliveryInfo) {
      axios.post(`${url}/deliveryInfo`, newDeliveryInfo)
        .then(response => {
          if (response.data && response.data._id) {
            setDeliveryInfo([...deliveryInfo, response.data]);
            createPaymentUrl(paymentData);
          } else {
            console.error('Invalid response format:', response.data);
          }
        })
        .catch(error => {
          console.error('There was an error creating the delivery info:', error);
        });
    } else {
      createPaymentUrl(paymentData);
    }
  };

  const createPaymentUrl = (paymentData) => {
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
      
      <div className="delivery-info-list">
        <h2>Existing Delivery Information</h2>
        {deliveryInfo.map(info => (
          <div key={info._id} className="delivery-info-item">
            <p><strong>Name:</strong> {info.receiver_name}</p>
            <p><strong>Phone:</strong> {info.phone_number}</p>
            <p><strong>Address:</strong> {info.address}</p>
            <button onClick={() => handleSelectDeliveryInfo(info)}>Select</button>
            <button onClick={() => handleDeleteDeliveryInfo(info._id)}>Delete</button>
          </div>
        ))}
      </div>

      <h2>{selectedDeliveryInfo ? 'Edit Delivery Information' : 'New Delivery Information'}</h2>
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
