import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets'; // Adjust the import path as needed
import './Staff.css'

const staffData = [
  {
    id: 1,
    name: "John Doe",
    phone: "123-456-7890",
    role: "Manager",
    password: "password123",
    email: "john@example.com"
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "987-654-3210",
    role: "Staff",
    password: "password456",
    email: "jane@example.com"
  },
  // Add more staff data as needed for testing
];

const StaffManagement = () => {
  const [list, setList] = useState(staffData);
  const [filteredStaff, setFilteredStaff] = useState(staffData);
  const [editingStaff, setEditingStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', role: '', password: '', email: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const startEditing = (staffId, currentStaff) => {
    setEditingStaff(staffId);
    setNewStaff(currentStaff);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value
    }));
  };

  const saveEdit = async (staffId) => {
    try {
      const response = await axios.put(`${url}/api/staff/edit`, {
        id: staffId,
        ...newStaff
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setEditingStaff(null);
      } else {
        toast.error("Error updating staff.");
      }
    } catch (error) {
      toast.error("Error updating staff.");
    }
  };
  

  const handleBlur = (staffId) => {
    saveEdit(staffId);
  };

  const handleKeyPress = (e, staffId) => {
    if (e.key === 'Enter') {
      saveEdit(staffId);
    }
  };

  const addStaff = async () => {
    try {
      const response = await axios.post(`${url}/api/staff/add`, newStaff);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setNewStaff({ name: '', phone: '', role: '', password: '', email: '' });
      } else {
        toast.error("Error adding staff.");
      }
    } catch (error) {
      toast.error("Error adding staff.");
    }
  };

  const removeStaff = async (staffId) => {
    try {
      const response = await axios.delete(`${url}/api/staff/delete`, {
        data: { id: staffId }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing staff.");
      }
    } catch (error) {
      toast.error("Error removing staff.");
    }
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/staff/list`);
      if (response.data.success) {
        setList(response.data.staff);
        setFilteredStaff(response.data.staff);
      } else {
        toast.error("Error fetching staff list.");
      }
    } catch (error) {
      toast.error("Error fetching staff list.");
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = list.filter((staff) =>
      staff.name.toLowerCase().includes(query)
    );
    setFilteredStaff(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage * itemsPerPage < filteredStaff.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: "15px", marginLeft: "15px" }}>
        <h1>Staff Management</h1>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginLeft: '20px', padding: '5px' }}
        />
      </div>
      <div>
        <h2 style={{ marginLeft: '40px' }}>Add New Staff</h2>
        <input
        style={{ marginRight: '10px',
          marginLeft: '40px',
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
          name="name"
          placeholder="Name"
          value={newStaff.name}
          onChange={handleEditChange}
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
          placeholder="Phone Number"
          value={newStaff.phone}
          onChange={handleEditChange}
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
          name="role"
          placeholder="Role"
          value={newStaff.role}
          onChange={handleEditChange}
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
          type="password"
          name="password"
          placeholder="Password"
          value={newStaff.password}
          onChange={handleEditChange}
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
          value={newStaff.email}
          onChange={handleEditChange}
        />
        <button onClick={addStaff} className='button-63'>Add Staff</button>
      </div>

      <h2 style={{ marginLeft: '40px' }}>Staff List</h2>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Name</b>
          <b>Phone</b>
          <b>Role</b>
          <b>Password</b>
          <b>Email</b>
          <b>Actions</b> {/* Added an Actions header */}
        </div>
        {currentItems.map((item, index) => (
          <div key={index} className='list-table-format'>
            {editingStaff === item.id ? (
              <>
                <input
                  type="text"
                  value={newStaff.name}
                  name="name"
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item.id)}
                  onKeyPress={(e) => handleKeyPress(e, item.id)}
                />
                <input
                  type="text"
                  value={newStaff.phone}
                  name="phone"
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item.id)}
                  onKeyPress={(e) => handleKeyPress(e, item.id)}
                />
                <input
                  type="text"
                  value={newStaff.role}
                  name="role"
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item.id)}
                  onKeyPress={(e) => handleKeyPress(e, item.id)}
                />
                <input
                  type="password"
                  value={newStaff.password}
                  name="password"
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item.id)}
                  onKeyPress={(e) => handleKeyPress(e, item.id)}
                />
                <input
                  type="email"
                  value={newStaff.email}
                  name="email"
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item.id)}
                  onKeyPress={(e) => handleKeyPress(e, item.id)}
                />
              </>
            ) : (
              <>
                <p onClick={() => startEditing(item.id, item)}>{item.name}</p>
                <p onClick={() => startEditing(item.id, item)}>{item.phone}</p>
                <p onClick={() => startEditing(item.id, item)}>{item.role}</p>
                <p onClick={() => startEditing(item.id, item)}>{item.password}</p>
                <p onClick={() => startEditing(item.id, item)}>{item.email}</p>
              </>
            )}
            <button onClick={() => removeStaff(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div className='pagination'>
        <button onClick={prevPage} disabled={currentPage === 1} className='button-63-2'>
          Previous
        </button>
        <button onClick={nextPage} disabled={currentPage * itemsPerPage >= filteredStaff.length} className='button-63-2'>
          Next
        </button>
      </div>
    </div>
  );
};

export default StaffManagement;
