import React, { useContext, useEffect, useState } from 'react'
import './Result.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Result = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const result = queryParams.get('vnp_TransactionStatus');
    const amount = queryParams.get('vnp_Amount');
    const transNo = queryParams.get('vnp_BankTranNo');
    const time = queryParams.get('vnp_PayDate');


    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [])

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
                                <h1>Payment Fail</h1>
                                <p>An error occured. Try again later!</p>
                            </div>
                        </div>
                    )}
                    <br />
                    <p>Details of transactions are included below.</p>
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
                        <td>{time}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="actions">
                    <button href="/">Home</button>
                    <button href="/menupage">To Menu</button>
                </div>
            </div>
        </div>
            
        </div>
    )
}

export default Result
