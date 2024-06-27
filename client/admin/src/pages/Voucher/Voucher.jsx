import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets'; // Adjust the import path as needed

import './Voucher.css';

const Voucher = () => {
  const [list, setList] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [newVoucher, setNewVoucher] = useState({ quantity: '', description: '', point: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startEditing = (voucherId, currentVoucher) => {
    setEditingVoucher(voucherId);
    setNewVoucher(currentVoucher);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value
    }));
  };

  const saveEdit = async (voucherId) => {
    try {
      const response = await axios.post(`${url}/api/voucher/edit`, {
        id: voucherId,
        ...newVoucher
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setEditingVoucher(null);
      } else {
        toast.error("Error updating voucher.");
      }
    } catch (error) {
      toast.error("Error updating voucher.");
    }
  };

  const addVoucher = async () => {
    try {
      const response = await axios.post(`${url}/api/voucher/add`, newVoucher);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setNewVoucher({ quantity: '', description: '', point: '' });
      } else {
        toast.error("Error adding voucher.");
      }
    } catch (error) {
      toast.error("Error adding voucher.");
    }
  };

  const removeVoucher = async (voucherId) => {
    try {
      const response = await axios.delete(`${url}/voucher/${voucherId}`);
      if (response.status === 200) {
        toast.success("Successfully removed");
        fetchList();
      } else {
        toast.error("Error removing voucher.");
      }
    } catch (error) {
      toast.error("Error removing voucher.");
    }
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/voucher`);
      if (response.status === 200) {
        setList(response.data);
      } else {
        toast.error("Error fetching voucher list.");
      }
    } catch (error) {
      toast.error("Error fetching voucher list.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredList = list.filter(
    (voucher) =>
      voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.required_points.toString().includes(searchQuery.toString())
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
      <h1 style={{ marginLeft: '10px' }}>Voucher Management</h1>
      <div>
        <h2 style={{ marginLeft: '10px' }}>Add New Voucher</h2>
        <input
          style={{ marginRight: '10px', marginLeft: '40px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="quantity"
          placeholder="Quantity"
          value={newVoucher.quantity}
          onChange={handleEditChange}
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="description"
          placeholder="Description"
          value={newVoucher.description}
          onChange={handleEditChange}
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="point"
          placeholder="Point"
          value={newVoucher.point}
          onChange={handleEditChange}
        />
        <button onClick={addVoucher} className='button-63'>Add Voucher</button>
      </div>

      <h2 style={{ marginLeft: '10px' }}>Voucher List</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Description</b>
          <b>Point</b>
          <b>Discount</b>
          <b>Actions</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format'>
            {editingVoucher === item._id ? (
              <>
                <input
                  type="text"
                  value={newVoucher.description}
                  name="description"
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="text"
                  value={newVoucher.point}
                  name="point"
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="text"
                  value={newVoucher.quantity}
                  name="quantity"
                  onChange={handleEditChange}
                  className="user-input"
                />
                <button onClick={() => saveEdit(item._id)} className='button-63'>Save</button>
                <button onClick={() => setEditingVoucher(null)} className='button-63'>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.description}</p>
                <p>{item.required_points}</p>
                <p>{item.discount}</p>
                <button onClick={() => startEditing(item._id, item)} className='button-63'>Edit</button>
              </>
            )}
            <button onClick={() => removeVoucher(item._id)} className='button-63'>Remove</button>
          </div>
        ))}
      </div>
      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Voucher;
