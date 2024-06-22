import { useState } from 'react';
import './RegisterOffline.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';

const RegisterOffline = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number. Please enter a valid 10-digit phone number.');
      return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email address. Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${url}/user/add`, formData);
      if (response.data.success) {
        toast.success('User registered successfully!');
        // Optionally, you can redirect or perform additional actions upon successful registration
        setFormData({
          userName: '',
          phone: '',
          email: '',
          password: '',
        });
      } else {
        toast.error(response.data.message); // Display error message from server if registration fails
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Failed to register user');
    }
  };

  return (
    <div className='app-content'>
      <Sidebar />
      <div className='register-form'>
        <h2>Register Offline</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='userName'>Username</label>
            <input
              type='text'
              id='userName'
              name='userName'
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='phone'>Phone</label>
            <input
              type='text'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterOffline;