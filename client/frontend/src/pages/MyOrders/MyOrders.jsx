import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext'; 
import { assets } from '../../assets/assets';
import ConfirmCancelModal from '../../components/ConfirmCancelModal/ConfirmCancelModal'; 
import ReviewForm from '../../components/WriteReview/ReviewForm';
import axios from 'axios'; 
import { Link } from 'react-router-dom'; // Import Link for navigation

const MyOrders = () => {
  const { url } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State to manage confirmation modal visibility
  const [orderToCancel, setOrderToCancel] = useState(null); // State to manage which order to cancel
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${url}/order`); // Fetching orders from the backend
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [url]);

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

  const handleOpenConfirm = (orderId) => {
    setOrderToCancel(orderId); 
    setIsConfirmOpen(true); 
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false); 
    setOrderToCancel(null); 
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      // Here, you might also want to send a request to the backend to cancel the order
      setData(prevData =>
        prevData.map(order =>
          order.id === orderToCancel ? { ...order, status: 'Cancelled' } : order
        )
      );
      handleCloseConfirm();
    }
  };

  const handleReview = (orderId) => {
    setShowReview(!showReview);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (data.length === 0) {
    return (
      <div className='my-orders'>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start exploring our delicious menu now!</p>
        <Link to="/menupage" className="go-to-menu-button">Go to Menu</Link>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="Parcel icon" />
            <p><b>Account ID:</b> {order.account_id}</p>
            <p><b>Delivery Info ID:</b> {order.delivery_info_id}</p>
            <p><b>Transaction ID:</b> {order.transaction_id}</p>
            <p><b>Order Items:</b> {order.items.map((item, idx) => (
              <span key={idx}>{item.name} x {item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
            ))}</p>
            <p><b>Shipping Fee:</b> ${order.shipping_fee}</p>
            <p><b>Status:</b> <span>&#x25cf;</span> {order.status}</p>
            <p><b>Completed At:</b> {order.completed_at ? new Date(order.completed_at).toLocaleString() : 'N/A'}</p>
            {order.status === 'In Progress' && (
              <button onClick={() => handleOrderClick(order)}>Track Order</button>
            )}
            {order.status === 'In Delivery' && (
              <button onClick={() => handleOpenConfirm(order.id)}>Cancel</button>
            )}
            {order.status === 'Delivered' && (
              <div>
                <button onClick={() => handleReview(order.id)}>Write Review</button>
                {showReview && <ReviewForm onClose={() => setShowReview(false)} />}
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <p><b>Account ID:</b> {selectedOrder.account_id}</p>
            <p><b>Delivery Info ID:</b> {selectedOrder.delivery_info_id}</p>
            <p><b>Transaction ID:</b> {selectedOrder.transaction_id}</p>
            <p><b>Order Items:</b></p>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <span>{item.name} x {item.quantity}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value))}
                  min="1"
                />
              </div>
            ))}
            <p><b>Shipping Fee:</b> ${selectedOrder.shipping_fee}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Completed At:</b> {selectedOrder.completed_at ? new Date(selectedOrder.completed_at).toLocaleString() : 'N/A'}</p>
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      )}
      <ConfirmCancelModal 
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};

export default MyOrders;
