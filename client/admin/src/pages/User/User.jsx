import React, { useState } from 'react';
import { toast } from 'react-toastify';

import './User.css';
import { url } from '../../assets/assets';
import axios from 'axios';
const UserList = () => {
  const [list, setList] = useState(userData);
  const [editingUser, setEditingUser] = useState(null);
  const [newIsBlock, setNewIsBlock] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '123456789'
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/account`);
      if (response.status == 200) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the account list.");
    }
  };



  const addUser = () => {
    const updatedList = [
      ...list,
      { ...newUser, id: list.length ? list[list.length - 1].id + 1 : 1 }
    ];
    setList(updatedList);
    setNewUser({ name: '', phone: '', email: '', password:'123456789'});
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

  useEffect(() => {
    fetchList();
  }, []);


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
        
        <button type="submit" className='button-63'>Add User</button>
      </form>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>User name</b>
          <b>Phone</b>
          <b>Email</b>
          <b>Point</b>
          <b>Status</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <p>{item.name}</p>
            <p>{item.phone}</p>
            <p>{item.email}</p>
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