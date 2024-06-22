import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin, setUser }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
// TODO: Handle set user
    setUser({
        name: "John",
        role: "onsite",
    });

    const [data, setData] = useState({
        userName: "",
        password: "",
        phone: "" // only used for sign-up
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
                const new_url = `${url}/signin/?userName=${data.userName}&password=${data.password}`;
                response = await axios.get(new_url);
            } else {
                const new_url = `${url}/signup/userName=${data.userName}&password=${data.password}&phone=${data.phone}`;
                response = await axios.post(new_url);
            }

            if (response.data === 1) { 
                if (currState === "Login") {
                    const token = response.headers['auth-token'] || response.data.token; 
                    setToken(token);
                    localStorage.setItem("token", token);
                    loadCartData({ token: token });
                }
                toast.success('Operation successful.');
                setShowLogin(false);
            } else {
                toast.error('Operation failed. Please check your details and try again.');
            }
        } catch (err) {
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
                    <input
                        name="phone"
                        onChange={onChangeHandler}
                        value={data.phone}
                        type="tel"
                        placeholder="Your phone number"
                        required={currState === "Sign Up"}
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
