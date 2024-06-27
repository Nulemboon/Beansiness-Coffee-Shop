import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets'; // Adjust the import path as needed
import './Staff.css';

const StaffManagement = () => {
  const [list, setList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [editStaffDetails, setEditStaffDetails] = useState({
    name: '',
    phone: '',
    email: '',
    role: ''
  });
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    password: '123456789'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/staff`);
      if (response.status === 200) {
        setList(response.data.staff);
        console.log(response.data.staff);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the staff list.");
    }
  };

  const addStaff = async () => {
    try {
      const response = await axios.post(`${url}/staff`, newStaff);
      if (response.status === 200) {
        fetchList();
        setNewStaff({ name: '', phone: '', email: '', role: '', password: '123456789' });
        toast.success("Staff added successfully.");
      } else {
        toast.error("Failed to add staff.");
      }
    } catch (error) {
      toast.error("Failed to add staff.");
    }
  };

  const removeStaff = async (staffId) => {
    try {
      const response = await axios.delete(`${url}/staff/${staffId}`);
      if (response.status === 200) {
        fetchList();
        toast.success("Staff removed successfully.");
      } else {
        toast.error("Failed to remove staff.");
      }
    } catch (error) {
      toast.error("Failed to remove staff.");
    }
  };

  const startEditing = (staff) => {
    setEditingStaff(staff._id);
    setEditStaffDetails({
      name: staff.account_id.name,
      phone: staff.account_id.phone,
      email: staff.account_id.email,
      role: staff.role
    });
  };

  const handleEditChange = (e) => {
    setEditStaffDetails({ ...editStaffDetails, [e.target.name]: e.target.value });
  };

  const saveEdit = async (staffId) => {
    try {
      const response = await axios.put(`${url}/staff/${staffId}`, editStaffDetails);
      if (response.status === 200) {
        fetchList();
        setEditingStaff(null);
        toast.success("Staff updated successfully.");
      } else {
        toast.error("Failed to update staff.");
      }
    } catch (error) {
      toast.error("Failed to update staff.");
    }
  };

  const cancelEditing = () => {
    setEditingStaff(null);
  };

  const handleNewStaffChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleNewStaffSubmit = (e) => {
    e.preventDefault();
    addStaff();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Ensure list is always an array
  const filteredList = list.filter(
    (staff) =>
      staff.account_id.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.account_id.phone.includes(searchQuery) ||
      staff.account_id.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1>Staff Management</h1>
        <input
          style={{ marginLeft: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          placeholder="Search ..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <form onSubmit={handleNewStaffSubmit} className="new-staff-form">
        <input
          style={{ marginLeft: '30px', marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="name"
          placeholder="Name"
          value={newStaff.name}
          onChange={handleNewStaffChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="phone"
          placeholder="Phone"
          value={newStaff.phone}
          onChange={handleNewStaffChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="email"
          name="email"
          placeholder="Email"
          value={newStaff.email}
          onChange={handleNewStaffChange}
          required
          className="user-input"

        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="role"
          placeholder="Role"
          value={newStaff.role}
          onChange={handleNewStaffChange}
          required
          className="user-input"

        />
        <button type="submit" className='button-63'>Add Staff</button>
      </form>

      <div className='list-table'>
        <div className='list-table-format1 title'>
          <b>Name</b>
          <b>Phone</b>
          <b>Email</b>
          <b>Role</b>
          <b>Actions</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format1'>
            {editingStaff === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editStaffDetails.name}
                  onChange={handleEditChange}
                  className="staff-input"
                />
                <input
                  type="text"
                  name="phone"
                  value={editStaffDetails.phone}
                  onChange={handleEditChange}
                  className="staff-input"
                />
                <input
                  type="email"
                  name="email"
                  value={editStaffDetails.email}
                  onChange={handleEditChange}
                  className="staff-input"
                />
                <input
                  type="text"
                  name="role"
                  value={editStaffDetails.role}
                  onChange={handleEditChange}
                  className="staff-input"
                />
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.account_id.name}</p>
                <p>{item.account_id.phone}</p>
                <p>{item.account_id.email}</p>
                <p>{item.role}</p>
                <button className='buttonne' onClick={() => startEditing(item)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                </button>                
                <button className='buttonne' onClick={() => removeStaff(item.account_id._id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
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

export default StaffManagement;