import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext'; 
import { assets } from '../../assets/assets';
import ConfirmCancelModal from '../../components/ConfirmCancelModal/ConfirmCancelModal'; 
import ReviewForm from '../../components/WriteReview/ReviewForm';

const mockOrders = [
  {
    "id": 1,
    "createdAt": "2024-06-15T14:48:00.000Z",
    "items": [
      { "name": "Espresso", "quantity": 2 },
      { "name": "Cappuccino", "quantity": 1 },
      { "name": "Iced Latte", "quantity": 1 }
    ],
    "amount": 18,
    "status": "Delivered",
    "account_id": "1234567890",
    "delivery_info_id": "del123",
    "shipping_fee": 5,
    "completed_at": "2024-06-15T16:00:00.000Z",
    "transaction_id": "txn123"
  },
  {
    "id": 2,
    "createdAt": "2024-06-16T10:22:00.000Z",
    "items": [
      { "name": "Green Tea", "quantity": 2 },
      { "name": "Matcha Latte", "quantity": 1 },
      { "name": "Chai Tea", "quantity": 2 }
    ],
    "amount": 22,
    "status": "In Progress",
    "account_id": "1234567891",
    "delivery_info_id": "del124",
    "shipping_fee": 4,
    "completed_at": null,
    "transaction_id": "txn124"
  },
  {
    "id": 3,
    "createdAt": "2024-06-17T08:00:00.000Z",
    "items": [
      { "name": "Smoothie - Berry Blast", "quantity": 1 },
      { "name": "Cold Brew", "quantity": 2 },
      { "name": "Hot Chocolate", "quantity": 1 }
    ],
    "amount": 24,
    "status": "Cancelled",
    "account_id": "1234567892",
    "delivery_info_id": "del125",
    "shipping_fee": 6,
    "completed_at": "2024-06-17T09:00:00.000Z",
    "transaction_id": "txn125"
  },
  {
    "id": 4,
    "createdAt": "2024-06-18T09:30:00.000Z",
    "items": [
      { "name": "Americano", "quantity": 1 },
      { "name": "Flat White", "quantity": 1 },
      { "name": "Mocha", "quantity": 2 }
    ],
    "amount": 20,
    "status": "Delivered",
    "account_id": "1234567893",
    "delivery_info_id": "del126",
    "shipping_fee": 3,
    "completed_at": "2024-06-18T11:00:00.000Z",
    "transaction_id": "txn126"
  },
  {
    "id": 5,
    "createdAt": "2024-06-19T11:45:00.000Z",
    "items": [
      { "name": "Lemonade", "quantity": 3 },
      { "name": "Iced Tea - Peach", "quantity": 2 },
      { "name": "Frappuccino", "quantity": 1 }
    ],
    "amount": 28,
    "status": "In Progress",
    "account_id": "1234567894",
    "delivery_info_id": "del127",
    "shipping_fee": 5,
    "completed_at": null,
    "transaction_id": "txn127"
  },
  {
    "id": 6,
    "createdAt": "2024-06-19T11:45:00.000Z",
    "items": [
      { "name": "Lemonade", "quantity": 3 },
      { "name": "Iced Tea - Peach", "quantity": 2 },
      { "name": "Frappuccino", "quantity": 1 }
    ],
    "amount": 28,
    "status": "In Delivery",
    "account_id": "1234567894",
    "delivery_info_id": "del127",
    "shipping_fee": 5,
    "completed_at": null,
    "transaction_id": "txn127"
  }
];

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
    setTimeout(() => {
      setData(mockOrders);
      setLoading(false);
    }, 1000);

    // Uncomment below and remove mock data above when ready to use the API
    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get(`${url}/vieworder`);
    //     setData(response.data);
    //   } catch (err) {
    //     console.error('Failed to fetch orders:', err);
    //     setError('Failed to load orders. Please try again.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchOrders();
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
                    <button onClick={() => handleReview(order)}>Write Review</button>
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
