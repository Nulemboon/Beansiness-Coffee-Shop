import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './UserInformation.css'; 
import ChangePassword from '../ChangePassword/ChangePassword';
import { StoreContext } from '../../Context/StoreContext';

const UserInformation = () => {
  const { url } = useContext(StoreContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${url}/account/667672a4da25253337cd4bb8`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [url]);

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-information">
      <h2>User Information</h2>
      {user ? (
        <div className="user-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Points:</strong> {user.point}</p>
          <button className="change-password-button" onClick={handleOpenChangePassword}>
            Change Password
          </button>
        </div>
      ) : (
        <div>No user information available.</div>
      )}
      <ChangePassword isOpen={isChangePasswordOpen} onClose={handleCloseChangePassword} />
    </div>
  );
};

export default UserInformation;
