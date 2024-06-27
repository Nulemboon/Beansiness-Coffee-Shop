import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import './User.css'; // Ensure the styles are in this CSS file
import { url } from '../../assets/assets';
import axios from 'axios';

const UserList = () => {
  const [list, setList] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserDetails, setEditUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
    isBlock: '',
  });
  const [newUser, setNewUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '123456789'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/account`);
      if (response.status === 200) {
        setList(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the account list.");
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(`${url}/account/add`, newUser);

      if (response.status === 200) {
        fetchList();
        setNewUser({ name: '', phone: '', email: '', password: '123456789' });
        toast.success("User added successfully.");
      } else {
        toast.error("Failed to add user.");
      }
    } catch (error) {
      console.error("There was an error adding the user!", error);
      toast.error("Failed to add user.");
    }
  };

  const removeUser = async (userId) => {
    try {
      const response = await axios.delete(`${url}/account/${userId}`);
      if (response.status === 200) {
        fetchList();
        toast.success("User removed successfully.");
      } else {
        toast.error("Failed to remove user.");
      }
    } catch (error) {
      console.error("There was an error removing the user!", error);
      toast.error("Failed to remove user.");
    }
  };

  const startEditing = (user) => {
    setEditingUser(user._id);
    setEditUserDetails({
      name: user.name,
      phone: user.phone,
      email: user.email,
      isBlock: user.isBlock,
    });
  };

  const handleEditChange = (e) => {
    setEditUserDetails({ ...editUserDetails, [e.target.name]: e.target.value });
  };

  const saveEdit = async (userId) => {
    try {
      const response = await axios.put(`${url}/account/${userId}`, editUserDetails);
      if (response.status === 200) {
        fetchList();
        setEditingUser(null);
        toast.success("User updated successfully.");
      } else {
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("There was an error updating the user!", error);
      toast.error("Failed to update user.");
    }
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleNewUserSubmit = (e) => {
    e.preventDefault();
    addUser();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter and paginate the list
  const filteredList = list.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: "15px", marginLeft: "15px" }}>
        <h1>User Management</h1>

        <input
          style={{ marginLeft: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <form onSubmit={handleNewUserSubmit} className="new-user-form">
        <input
          style={{ marginLeft: '30px', marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleNewUserChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="phone"
          placeholder="Phone"
          value={newUser.phone}
          onChange={handleNewUserChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleNewUserChange}
          required
          className="user-input"
        />
        <button type="submit" className='button-63'>Add User</button>
      </form>

      <div className='list-table'>
        <div className='list-table-format1 title'>
          <b>User name</b>
          <b>Phone</b>
          <b>Email</b>
          <b>Point</b>
          <b>Status</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format1'>
            {editingUser === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editUserDetails.name}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="text"
                  name="phone"
                  value={editUserDetails.phone}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="email"
                  name="email"
                  value={editUserDetails.email}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="text"
                  name="isBlock"
                  value={editUserDetails.isBlock}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.phone}</p>
                <p>{item.email}</p>
                <p>{item.point}</p>
                <p
                  onClick={() => startEditing(item._id, item.isBlock)}
                  style={{ color: item.isBlock ? 'red' : 'green' }}
                >
                  {item.isBlock ? 'Blocked' : 'Active'}
                </p>
                <button className='buttonne' onClick={() => startEditing(item)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                </button>
                <button className='buttonne' onClick={() => removeUser(item._id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                </button>
              </>
            )}

          </div>
        ))}
      </div>
      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className='button-63-2'>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className='button-63-2'>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
