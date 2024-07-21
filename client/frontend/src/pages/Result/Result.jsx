import React, { useState, useEffect, useContext } from 'react';
import './Result.css';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

const Result = () => {
    toast.success("Transaction successfully");
    const [cookies, setCookie, removeCookie, remove] = useCookies(['cart']);
    const { url } = useContext(StoreContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [transactionDetails, setTransactionDetails] = useState(null);
    const transactionId = queryParams.get('transactionId');

    // useEffect(() => {
    //     const fetchTransactionDetails = async () => {
    //         try {
    //             const response = await axios.get(`${url}/transaction/${transactionId}`);
    //             setTransactionDetails(response.data);
    //             const getcart = await axios.get(`${url}/cart`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //                 },
    //             });
    //         } catch (error) {
    //             console.error('Error fetching transaction details:', error);
    //         }
    //     };

    //     fetchTransactionDetails();
    // }, [transactionId, url]);

    useEffect(() => {
        const fetchTransactionDetailsAndPlaceOrder = async () => {
            try {
                const response = await axios.get(`${url}/transaction/${transactionId}`);
                setTransactionDetails(response.data);
                
                if (response.data.message === 'success' && !orderPlaced) {
                    const deliveryInfoId = localStorage.getItem('deliveryInfoId');

                    await axios.post(`${url}/order`, {
                        deliveryId: deliveryInfoId,
                        transactionId: response.data.transaction_id,
                        shippingFee: 20000
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        withCredentials: true
                    });

                    localStorage.removeItem('deliveryInfoId');
                    removeCookie('cart', { path: '/' });
                    removeCookie('voucher_id', { path: '/' });

                    setOrderPlaced(true);
                }
            } catch (error) {
                console.error('Error fetching transaction details or placing order:', error);
            }
        };

        fetchTransactionDetailsAndPlaceOrder();
    }, []);

    if (!transactionDetails) {
        return <div>Loading...</div>;
    }

    const { amount, created_at, message, transaction_content, transaction_id, transaction_num } = transactionDetails;
    const formattedTime = moment(created_at).format('DD/MM/YYYY HH:mm:ss');

    return (
        <div className="app-container">
            <div className="result-container">
                <div className="result-message">
                    <div className='result'>
                        <div className="message">
                            <img src={message === 'success' ? assets.checkmark : assets.cross} alt={message === 'success' ? 'Success' : 'Failure'} />
                            <div>
                                <h1>{message === 'success' ? 'Payment Successful' : 'Payment Failed'}</h1>
                                <p>{message}</p>
                            </div>
                        </div>
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
                                <td>Transaction ID</td>
                                <td>{transaction_id}</td>
                            </tr>
                            <tr>
                                <td>Transaction No</td>
                                <td>{transaction_num}</td>
                            </tr>
                            <tr>
                                <td>Transaction Time</td>
                                <td>{formattedTime}</td>
                            </tr>
                            <tr>
                                <td>Transaction Content</td>
                                <td>{transaction_content}</td>
                            </tr>
                        </tbody>
                    </table>
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
