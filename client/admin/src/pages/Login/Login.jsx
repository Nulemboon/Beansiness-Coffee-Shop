import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { toast } from 'react-toastify';
const Login = ({ setIsAuthenticated }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/account/login', {
        phone,
        password,
      });
      if (response.status === 200) {
        const { token, role } = response.data;
        if (role === 'Admin') {
          localStorage.setItem('authToken', token);
          setIsAuthenticated(true); // Update the authenticated state
          navigate('/list'); // Redirect to the list page
        } else {
          toast.error('Access denied: Only Admins can log in');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Account does not exist');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
