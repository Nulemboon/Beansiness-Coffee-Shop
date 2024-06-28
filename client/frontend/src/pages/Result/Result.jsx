import React, { useState, useEffect, useContext } from 'react';
import './Result.css';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { assets } from '../../assets/assets';
import { useCookies } from 'react-cookie';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Result = () => {
    const { url } = useContext(StoreContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();

    const [cookies, setCookie, removeCookie] = useCookies(['cart', 'voucher_id', 'voucher_name']);
    const [orderDetails, setOrderDetails] = useState([]);

    const result = queryParams.get('vnp_TransactionStatus');
    const amount = queryParams.get('vnp_Amount') / 100;
    const transNo = queryParams.get('vnp_BankTranNo');
    const time = queryParams.get('vnp_PayDate');
    const transactionId = queryParams.get('transactionId');
    const voucherName = cookies.voucher_name;

    const formattedTime = moment(time, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss');

    useEffect(() => {
        const currentCart = cookies.cart || [];
        if (currentCart.length > 0) {
            setOrderDetails(currentCart);
            console.log("Cart contents:", currentCart);
        }
    }, [cookies.cart]);

    useEffect(() => {
        console.log('Voucher ID:', cookies.voucher_id);
        console.log('Voucher Name:', voucherName);

        if (orderDetails.length > 0 && result === '00') {
            const placeOrder = async () => {
                try {
                    const deliveryInfoId = localStorage.getItem('deliveryInfoId');
                    console.log('Delivery Info ID:', deliveryInfoId);

                    const response = await axios.post(`${url}/order`, {
                        delivery_info_id: deliveryInfoId,
                        shipping_fee: 20000,
                        transaction_id: transactionId,
                        voucher_id: cookies.voucher_id
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        withCredentials: true 
                    });

                    console.log('Order placed successfully:', response.data);
                } catch (error) {
                    console.error('Error placing order:', error);
                }
            };

            placeOrder();
            removeCookie('cart', { path: '/' });
            removeCookie('voucher_id', { path: '/' });
            removeCookie('voucher_name', { path: '/' });
            localStorage.removeItem('deliveryInfoId'); // Remove the delivery info ID after placing the order
        }
    }, [orderDetails, result, transactionId, removeCookie, cookies.voucher_id, voucherName, url]);

    return (
        <div className="app-container">
            <div className="result-container">
                <div className="result-message">
                    <div className='result'>
                        {result === '00' ? (
                            <div className="message">
                                <img src={assets.checkmark} alt='Success' />
                                <div>
                                    <h1>Payment Successful</h1>
                                    <p>Your payment has been processed!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="message">
                                <img src={assets.cross} alt='Failure' />
                                <div>
                                    <h1>Payment Failed</h1>
                                    <p>An error occurred. Try again later!</p>
                                </div>
                            </div>
                        )}
                        <br />
                        <p>Details of the transaction are included below.</p>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Amount</td>
                                <td>{amount} VND</td>
                            </tr>
                            <tr>
                                <td>Transaction No</td>
                                <td>{transNo}</td>
                            </tr>
                            <tr>
                                <td>Transaction Time</td>
                                <td>{formattedTime}</td>
                            </tr>
                            {voucherName && (
                                <tr>
                                    <td>Voucher</td>
                                    <td>{voucherName}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {orderDetails.length > 0 && (
                        <div>
                            <h2 style={{ color: 'brown' }}>Order Details</h2>                           
                             <table>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.price} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="actions">
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => navigate('/menupage')}>To Menu</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Result;
