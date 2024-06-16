import React, { useEffect, useState } from 'react';
import './MyOrders.css';
// import { StoreContext } from '../../Context/StoreContext'; 
import { assets } from '../../assets/assets';
import mockOrders from '../../../../backend/Fake_Data(to_be_deleted)/mockOrder.js'; 

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 

  useEffect(() => {
    setTimeout(() => {
      setData(mockOrders);
    }, 1000); 
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedOrder = { ...selectedOrder };
    updatedOrder.items[index].quantity = quantity;
    setSelectedOrder(updatedOrder);
  };

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order' onClick={() => handleOrderClick(order)}>
            <img src={assets.parcel_icon} alt="Parcel icon" />
            <p>{order.items.map((item, idx) => (
              <span key={idx}>{item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
            ))}</p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={() => handleOrderClick(order)}>Track Order</button>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>{item.name}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value))}
                  min="1"
                />
              </div>
            ))}
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
