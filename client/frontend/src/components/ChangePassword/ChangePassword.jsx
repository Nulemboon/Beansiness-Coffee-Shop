import React, { useState, useContext } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import { StoreContext } from '../../Context/StoreContext'; // Adjust the path based on your project structure

const ChangePassword = ({ isOpen, onClose }) => {
    const { url, setToken } = useContext(StoreContext); 
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${url}/user/change-password`, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess('Password changed successfully.');
                toast.success('Password changed successfully.');
                setToken(response.data.token); 
            } else {
                setError(response.data.message || 'Failed to change password.');
                toast.error(response.data.message || 'Failed to change password.');
            }
        } catch (err) {
            setError('Failed to change password. Please try again.');
            toast.error('Failed to change password. Please try again.');
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword} className="change-password-form">
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button type="submit" className="submit-button">Change Password</button>
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default ChangePassword;
