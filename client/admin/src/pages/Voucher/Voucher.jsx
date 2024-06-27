import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { url } from '../../assets/assets';
import axios from 'axios';

const Voucher = () => {
  const [list, setList] = useState([]);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [editVoucherDetails, setEditVoucherDetails] = useState({
    description: '',
    required_points: '',
    name: '',
    discount: ''
  });
  const [newVoucher, setNewVoucher] = useState({
    description: '',
    required_points: '',
    name: '',
    discount: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/voucher`);
      if (response.status === 200) {
        setList(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the voucher list.");
    }
  };

  const addVoucher = async () => {
    try {
      const response = await axios.post(`${url}/voucher`, newVoucher);

      if (response.status === 200) {
        fetchList();
        setNewVoucher({ name: '', description: '', discount: '', required_points: '' });
        toast.success("Voucher added successfully.");
      } else {
        toast.error("Failed to add voucher.");
      }
    } catch (error) {
      console.error("There was an error adding the voucher!", error);
      toast.error("Failed to add voucher.");
    }
  };

  const removeVoucher = async (voucherId) => {
    try {
      const response = await axios.delete(`${url}/voucher/${voucherId}`);
      if (response.status === 200) {
        fetchList();
        toast.success("Voucher removed successfully.");
      } else {
        toast.error("Failed to remove voucher.");
      }
    } catch (error) {
      console.error("There was an error removing the voucher!", error);
      toast.error("Failed to remove voucher.");
    }
  };

  const startEditing = (voucher) => {
    setEditingVoucher(voucher._id);
    setEditVoucherDetails({
      name: voucher.name,
      description: voucher.description,
      discount: voucher.discount,
      required_points: voucher.required_points,
    });
  };

  const handleEditChange = (e) => {
    setEditVoucherDetails({ ...editVoucherDetails, [e.target.name]: e.target.value });
  };

  const saveEdit = async (voucherId) => {
    try {
      const response = await axios.put(`${url}/voucher/${voucherId}`, editVoucherDetails);
      if (response.status === 200) {
        fetchList();
        setEditingVoucher(null);
        toast.success("Voucher updated successfully.");
      } else {
        toast.error("Failed to update voucher.");
      }
    } catch (error) {
      console.error("There was an error updating the voucher!", error);
      toast.error("Failed to update voucher.");
    }
  };

  const cancelEditing = () => {
    setEditingVoucher(null);
  };

  const handleNewVoucherChange = (e) => {
    setNewVoucher({ ...newVoucher, [e.target.name]: e.target.value });
  };

  const handleNewVoucherSubmit = (e) => {
    e.preventDefault();
    addVoucher();
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
    (voucher) =>
      voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.description.includes(searchQuery) 
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
        <h1>Voucher Management</h1>

        <input
          style={{ marginLeft: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <form onSubmit={handleNewVoucherSubmit} className="new-user-form">
        <input
          style={{ marginLeft: '30px', marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="name"
          placeholder="Name"
          value={newVoucher.name}
          onChange={handleNewVoucherChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="description"
          placeholder="Description"
          value={newVoucher.description}
          onChange={handleNewVoucherChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="number"
          name="required_points"
          placeholder="Required point"
          value={newVoucher.required_points}
          onChange={handleNewVoucherChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="number"
          name="discount"
          placeholder="Discount amount"
          value={newVoucher.discount}
          onChange={handleNewVoucherChange}
          required
          className="user-input"
        />
        <button type="submit" className='button-63'>Add Voucher</button>
      </form>

      <div className='list-table'>
        <div className='list-table-format1 title'>
          <b>Voucher name</b>
          <b>Description</b>
          <b>Required point</b>
          <b>Discount amount</b>
          <b>Action</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format1'>
            {editingVoucher === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editVoucherDetails.name}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="text"
                  name="description"
                  value={editVoucherDetails.description}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="number"
                  name="required_points"
                  value={editVoucherDetails.required_points}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <input
                  type="number"
                  name="discount"
                  value={editVoucherDetails.discount}
                  onChange={handleEditChange}
                  className="user-input"
                />
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.required_points}</p>
                <p>{item.discount}</p>
              
                <button className='buttonne' onClick={() => startEditing(item)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                </button>
                <button className='buttonne' onClick={() => removeVoucher(item._id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
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

export default Voucher;