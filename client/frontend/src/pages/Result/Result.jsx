import React from 'react';
import './Result.css';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { assets } from '../../assets/assets';

const Result = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate(); 

    const result = queryParams.get('vnp_TransactionStatus');
    const amount = queryParams.get('vnp_Amount')/100;
    const transNo = queryParams.get('vnp_BankTranNo');
    const time = queryParams.get('vnp_PayDate');

    const formattedTime = moment(time, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm:ss');

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
                                <td>Transaction ID</td>
                                <td>{transNo}</td>
                            </tr>
                            <tr>
                                <td>Transaction Time</td>
                                <td>{formattedTime}</td>
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
