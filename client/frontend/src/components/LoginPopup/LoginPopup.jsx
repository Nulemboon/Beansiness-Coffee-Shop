import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setAuthToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        userName: "",  
        phone: "",     
        email: "",     
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
    
        try {
            let response;
            if (currState === "Login") {
                const new_url = `${url}/account/login`;
                response = await axios.post(new_url, {
                    phone: data.phone,
                    password: data.password
                });
            } else {
                const new_url = `${url}/account/register`;
                response = await axios.post(new_url, {
                    name: data.userName,
                    phone: data.phone,
                    email: data.email,
                    password: data.password
                });
            }
    
            const token = response.data.token;
            localStorage.setItem('role', response.data.role);

            if (token) {
                console.log("Token received:", token); 
                // setToken(token);
                setAuthToken(response.data.token);
                localStorage.setItem("token", token);
                await loadCartData(); 
                toast.success('Operation successful.');
                setShowLogin(false);
            } else {
                console.warn('Server response indicates failure:', response.data);
                toast.error(response.data.message || 'Operation failed. Please check your details and try again.');
            }
        } catch (err) {
            console.error('Error during login/register:', err.response ? err.response.data : err.message);
            toast.error('An error occurred. Please try again.');
        }
    };
    
    

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            name='userName'
                            onChange={onChangeHandler}
                            value={data.userName}
                            type="text"
                            placeholder='Your name'
                            required
                        />
                    )}
                    {currState === "Sign Up" && (
                        <input
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Your email'
                            required
                        />
                    )}
                    <input
                        name="phone"
                        onChange={onChangeHandler}
                        value={data.phone}
                        type="tel"
                        placeholder="Your phone number"
                        required
                    />
                    <input
                        name='password'
                        onChange={onChangeHandler}
                        value={data.password}
                        type="password"
                        placeholder='Password'
                        required
                    />
                </div>
                <button type="submit">{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;