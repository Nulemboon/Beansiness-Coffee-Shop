import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDay, setFilterDay] = useState('');
  const [filterProductName, setFilterProductName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/order`);
      if (response.status === 200) {
        const fetchedOrders = response.data.reverse();
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filterDay, filterProductName, filterStatus, orders]);

  const filterOrders = () => {
    let tempOrders = orders;

    if (filterDay) {
      tempOrders = tempOrders.filter(order => 
        new Date(order.completed_at).toLocaleDateString() === new Date(filterDay).toLocaleDateString()
      );
    }

    if (filterProductName) {
      tempOrders = tempOrders.filter(order =>
        order.order_items.some(item => 
          item.product_id.name.toLowerCase().includes(filterProductName.toLowerCase())
        )
      );
    }

    if (filterStatus) {
      tempOrders = tempOrders.filter(order => order.status === filterStatus);
    }

    setFilteredOrders(tempOrders);
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Done':
        return { color: 'green' };
      case 'Cancelled':
        return { color: 'red' };
      case 'Pending':
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="filters">
        <input
          type="date"
          value={filterDay}
          onChange={e => setFilterDay(e.target.value)}
          placeholder="Filter by day"
        />
        <input
          type="text"
          value={filterProductName}
          onChange={e => setFilterProductName(e.target.value)}
          placeholder="Filter by product name"
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Done">Done</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="order-list">
        {filteredOrders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Parcel icon" />
            <div>
              <p className='order-item-food'>
                {order.order_items.map((item, idx) => (
                  <span key={idx}>
                    {item.product_id.name} x {item.quantity} ({item.toppings.map(topping => topping.name).join(', ')}){idx !== order.order_items.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              {order.shipping_fee !== 0 && (
                <>
                  <p className='order-item-name'>{order.delivery_info.receiver_name}</p>
                  <div className='order-item-address'>
                    <p>{order.delivery_info.address}</p>
                  </div>
                  <p className='order-item-phone'>{order.delivery_info.phone_number}</p>
                </>
              )}
            </div>
            <p>Items: {order.order_items.length}</p>
            <p>${calculateTotalAmount(order.order_items, order.shipping_fee).toFixed(2)}</p>
            <p style={getStatusStyle(order.status)}>{order.status}</p>
            <p>{order.shipping_fee === 0 ? 'Offline Order' : `Online Order (Delivery Fee: $${order.shipping_fee})`}</p>
            <p>Order Date: {formatDate(order.completed_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
