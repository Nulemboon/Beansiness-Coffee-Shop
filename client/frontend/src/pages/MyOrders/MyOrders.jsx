import React, { useEffect, useState, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import ConfirmCancelModal from '../../components/ConfirmCancelModal/ConfirmCancelModal';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MyOrderDetail from '../../components/MyOrderDetail/MyOrderDetail';

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
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

    const handleOpenConfirm = (orderId) => {
        console.log('Order ID:', orderId);
        setOrderToCancel(orderId);
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
        setOrderToCancel(null);
    };

    const handleConfirmCancel = async () => {
        console.log(orderToCancel); 
        console.log(localStorage.getItem('token'));
        try {
            const response = await axios.post(`${url}/order/cancel/${orderToCancel}`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Order cancellation successful:', response.data);
            setData(prevData => prevData.filter(order => order._id !== orderToCancel));
            handleCloseConfirm(); 
        } catch (error) {
            console.error('Error cancelling order:', error);

        }
    };  
    

    const handleToggleOverlay = (index) => {
        setIsOverlayOpen(index);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(-1);
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
    const orderStatus = ['Shipping', 'Approved', 'Pending', 'Done', 'Rejected', 'Cancelled'];
    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                <div className="my-order">
                    {orderStatus.map((curStatus, idx) => (
                        <div key={idx} className="my-order">
                            <h3>{curStatus} Order</h3>
                            {data.map((order, index) => (
                                (order.status === curStatus) ? (
                                    <>
                                        <div key={index} className='my-orders-order' onClick={() => handleToggleOverlay(index)}>
                                            <img src={assets.parcel_icon} alt="Parcel icon" />
                                            <p className='p-order-item'><b>Order Items:</b> {order.order_items.map((item, idx) => (
                                                <span key={idx}>{item.product_id.name}{item.toppings.length > 0 ? `(${item.toppings.map(topping => topping.name).join(', ')})` : ''} x {item.quantity}{idx < order.order_items.length - 1 ? ', ' : ''}</span>
                                            ))}</p>
                                            <p><b>Status:</b> <span>&#x25cf;</span> {order.status}</p>
                                            <p><b>Completed At:</b> {order.completed_at ? new Date(order.completed_at).toLocaleString() : 'N/A'}</p>
                                           
                                        </div>
                                        {order.status === 'Pending' && (
                                                <button onClick={() => handleOpenConfirm(order._id)}>Cancel</button>
                                            )}  
                                        {isOverlayOpen === index && (
                                            <MyOrderDetail order={order} onClose={closeOverlay} />
                                        )}
                                    </>
                                ) : null
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmCancelModal
                isOpen={isConfirmOpen}
                orderId={orderToCancel}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmCancel}
            />
        </div>
    );
};

export default MyOrders;
