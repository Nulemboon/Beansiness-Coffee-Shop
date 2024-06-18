import React, { useState } from 'react';
import { toast } from 'react-toastify';

import './User.css';

const userData = [
  {
    "id": 1,
    "name": "John Doe",
    "phone": "123-456-7890",
    "email": "john.doe@example.com",
    "bankId": "123456789",
    "point": 100,
    "isBlock": "active"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "phone": "987-654-3210",
    "email": "jane.smith@example.com",
    "bankId": "987654321",
    "point": 200,
    "isBlock": "blocked"
  }
];

const UserList = () => {
  const [list, setList] = useState(userData);
  const [editingUser, setEditingUser] = useState(null);
  const [newIsBlock, setNewIsBlock] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    bankId: '',
    point: '',
    isBlock: ''
  });

  const addUser = () => {
    const updatedList = [
      ...list,
      { ...newUser, id: list.length ? list[list.length - 1].id + 1 : 1 }
    ];
    setList(updatedList);
    setNewUser({ name: '', phone: '', email: '', bankId: '', point: '', isBlock: '' });
    toast.success("User added successfully.");
  };

  const removeUser = (userId) => {
    const updatedList = list.filter((user) => user.id !== userId);
    setList(updatedList);
    toast.success("User removed successfully.");
  };

  const startEditing = (userId, currentUserIsBlock) => {
    setEditingUser(userId);
    setNewIsBlock(currentUserIsBlock);
  };

  const handleEditChange = (e) => {
    setNewIsBlock(e.target.value);
  };

  const saveEdit = (userId) => {
    const updatedList = list.map((user) =>
      user.id === userId ? { ...user, isBlock: newIsBlock } : user
    );
    setList(updatedList);
    setEditingUser(null);
    toast.success("User updated successfully.");
  };

  const handleBlur = (userId) => {
    saveEdit(userId);
  };

  const handleKeyPress = (e, userId) => {
    if (e.key === 'Enter') {
      saveEdit(userId);
    }
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleNewUserSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <div>
      <h1 style={{ marginLeft: '10px' }}>User Management</h1>
      <form onSubmit={handleNewUserSubmit} className="new-user-form">
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            width: '180px',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleNewUserChange}
          required
        />
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '180px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}

          type="text"
          name="phone"
          placeholder="Phone"
          value={newUser.phone}
          onChange={handleNewUserChange}
          required
        />
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '180px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}

          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleNewUserChange}
          required
        />
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            width: '180px',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}

          type="text"
          name="bankId"
          placeholder="Bank ID"
          value={newUser.bankId}
          onChange={handleNewUserChange}
          required
        />
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '180px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}

          type="number"
          name="point"
          placeholder="Point"
          value={newUser.point}
          onChange={handleNewUserChange}
          required
        />
        <input
          style={{ marginRight: '10px',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '180px',
            fontSize: '14px',
            fontFamily: 'inherit',
            color: '#333',
            backgroundColor: '#fff',
            transition: 'border-color 0.3s ease',
            '&:focus': {
              outline: 'none',
              borderColor: '#6c63ff',
              boxShadow: '0 0 5px rgba(108, 99, 255, 0.5)',
            }, }}

          type="text"
          name="isBlock"
          placeholder="Status"
          value={newUser.isBlock}
          onChange={handleNewUserChange}
          required
        />
        <button type="submit" className='button-63'>Add User</button>
      </form>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>User name</b>
          <b>Phone</b>
          <b>Email</b>
          <b>Bank ID</b>
          <b>Point</b>
          <b>Status</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <p>{item.name}</p>
            <p>{item.phone}</p>
            <p>{item.email}</p>
            <p>{item.bankId}</p>
            <p>{item.point}</p>
            {editingUser === item.id ? (
              <input
                type="text"
                value={newIsBlock}
                onChange={handleEditChange}
                onBlur={() => handleBlur(item.id)}
                onKeyPress={(e) => handleKeyPress(e, item.id)}
              />
            ) : (
              <p
                onClick={() => startEditing(item.id, item.isBlock)}
                style={{ color: item.isBlock === 'blocked' ? 'red' : 'green' }}
              >
                {item.isBlock}
              </p>
            )}
            <button onClick={() => removeUser(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;