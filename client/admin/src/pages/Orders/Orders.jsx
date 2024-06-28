import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/order`);
      if (response.status === 200) {
        setOrders(response.data.reverse());
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    }
  };

  const statusHandler = async (orderId, status) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("An error occurred while updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return { color: 'green' };
      case 'Cancelled':
        return { color: 'red' };
      case 'Processing':
      default:
        return { color: 'grey' };
    }
  };

  const calculateTotalAmount = (orderItems, shippingFee) => {
    let total = 0;
    orderItems.forEach(item => {
      total += item.product_id.price * item.quantity;
      item.toppings.forEach(topping => {
        total += topping.price * item.quantity;
      });
    });
    return total + shippingFee;
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel icon" />
            <div>
              <p className='order-item-food'>
                {order.order_items.map((item, idx) => (
                  <span key={idx}>
                    {item.product_id.name} x {item.quantity} ({item.toppings.map((topping, i) => topping.name).join(', ')}){idx !== order.order_items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              <p className='order-item-name'>{order.delivery_info.receiver_name}</p>
              <div className='order-item-address'>
                <p>{order.delivery_info.address}</p>
              </div>
              <p className='order-item-phone'>{order.delivery_info.phone_number}</p>
            </div>
            <p>Items: {order.order_items.length}</p>
            <p>${calculateTotalAmount(order.order_items, order.shipping_fee).toFixed(2)}</p>
            <p style={getStatusStyle(order.status)}>{order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;