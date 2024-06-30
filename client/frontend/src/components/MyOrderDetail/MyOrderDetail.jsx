import React, { useState } from 'react';
import './MyOrderDetail.css';
import ReviewForm from '../../components/WriteReview/ReviewForm';

const MyOrderDetail = ({ order, onClose }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const getTotalPrice = () => {
        let total = 0;
        order.order_items.forEach(item => {
            total += (item.product_id.price + (item.toppings || []).reduce((sum, topping) => sum + (topping.price || 0), 0)) * item.quantity;
        });
        return total;
    };

    const handleReviewClick = (item) => {
        setSelectedItem(item);
    };

    const closeReview = () => {
        setSelectedItem(null);
    };

    return (
        <div className='modal-overlay' onClick={onClose}>
            <span className='close-button' onClick={onClose}>&times;</span>
            <div className='modal-content' onClick={(e) => e.stopPropagation()} style={{ width: selectedItem ? '1000px' : '800px' }}>
                <br />
                <h3>Order Detail</h3>
                <div className='list-order'>
                    <div className="cart-items">
                        <div className="cart-items-title">
                            <p>Title</p>
                            <p>Size</p>
                            <p>Toppings</p>
                            <p>Price</p>
                            <p>Quantity</p>
                            <p>Total</p>
                        </div>
                        <br />
                        <hr />
                        {order.order_items.map((item, index) => (
                            <div key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <p>{item.product_id.name}</p>
                                    <p>{item.size}</p>
                                    <p>{(item.toppings || []).map(topping => topping.name).join(', ')}</p>
                                    <p>{item.product_id.price} VND</p>
                                    <p>{item.quantity}</p>
                                    <p>
                                        {(item.product_id.price + (item.toppings || []).reduce((sum, topping) => sum + (topping.price || 0), 0)) * item.quantity} VND
                                    </p>
                                    {order.status === 'Done' && (
                                        <button onClick={() => handleReviewClick(item)}>Write Review</button>
                                    )}
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                <div className="cart-total">
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{getTotalPrice()} VND</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{order.shipping_fee} VND</p></div>
                        <hr />
                        <div className='cart-total-details'><p>Voucher Sale</p><p>{(order.voucher_id) ? order.voucher_id.discount : 0} VND</p></div>
                        <hr />
                        <div className='cart-total-details'><p>Total</p><p>{getTotalPrice() - ((order.voucher_id) ? order.voucher_id.discount : 0)} VND</p></div>
                    </div>
                </div>
                <br />
                <h3>Delivery Info</h3>
                <div className="delivery-info">
                    <div><p>Receiver Name: </p><p>{order.delivery_info?.receiver_name || 'N/A'}</p></div>
                    <div><p>Address: </p><p>{order.delivery_info?.address || 'N/A'}</p></div>
                    <div><p>Phone Number: </p><p>{order.delivery_info?.phone_number || 'N/A'}</p></div>
                    <div><p>Instruction: </p><p>{order.delivery_info?.instruction || 'N/A'}</p></div>
                </div>
                {selectedItem && (
                    <div>
                        <ReviewForm item={selectedItem} onClose={closeReview} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrderDetail;
