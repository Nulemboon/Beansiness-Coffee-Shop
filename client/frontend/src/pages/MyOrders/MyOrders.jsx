import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import ConfirmCancelModal from '../../components/ConfirmCancelModal/ConfirmCancelModal';
import ReviewForm from '../../components/WriteReview/ReviewForm';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MyOrderDetail from '../../components/MyOrderDetail/MyOrderDetail';

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [showReview, setShowReview] = useState(false);


    const [isOverlayOpen, setIsOverlayOpen] = useState(-1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/account/current`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                setData(response.data.order_id);
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

    const handleToggleOverlay = (index) => {
        setIsOverlayOpen(index);
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

    // Order status
    const orderStatus = ['Shipping', 'Approved', 'Pending', 'Done', 'Rejected'];

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                <div className="my-order">
                    {orderStatus.map((curStatus, idx) => (
                        <div className="my-order">
                        <h3>{curStatus} Order</h3>
                        {data.map((order, index) => (
                            (order.status == curStatus) ? (
                                <>
                                    <div key={index} className='my-orders-order' onClick={() => handleToggleOverlay(index)}>
                                        <img src={assets.parcel_icon} alt="Parcel icon" />
                                        <p className='p-order-item'><b>Order Items:</b> {order.order_items.map((item, idx) => (
                                            <span key={idx}>{item.product_id.name}{item.toppings.length > 0 ? `(${item.toppings.map(topping => topping.name).join(', ')})` : ''} x {item.quantity}{idx < order.order_items.length - 1 ? ', ' : ''}</span>
                                        ))}</p>
                                        <p><b>Status:</b> <span>&#x25cf;</span> {order.status}</p>
                                        <p><b>Completed At:</b> {order.completed_at ? new Date(order.completed_at).toLocaleString() : 'N/A'}</p>
                                        {order.status === 'Shipping' && (
                                            <button onClick={() => handleOrderClick(order)}>Track Order</button>
                                        )}
                                        {order.status === 'Pending' && (
                                            <button onClick={() => handleOpenConfirm(order.id)}>Cancel</button>
                                        )}
                                        {order.status === 'Done' && (
                                            <div>
                                                <button onClick={() => handleReview(order.id)}>Write Review</button>
                                                {showReview && <ReviewForm onClose={() => setShowReview(false)} />}
                                            </div>
                                        )}
                                    </div>
                                    {
                                        (isOverlayOpen == index) ? (<MyOrderDetail order={order} onClose={() => setIsOverlayOpen(-1)}></MyOrderDetail>) : ''
                                    }
                                </>
                            )
                                : ''))}
                        </div>
                    ))}
                    
                </div>
            </div>

            <ConfirmCancelModal
                isOpen={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default MyOrders;
