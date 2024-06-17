import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets'; // Adjust the import path as needed

import './Voucher.css'
const voucherData = [
  {
    id: 1,
    quantity: 10,
    description: "hihi",
    point: 100
  },
  {
    id: 2,
    quantity: 15,
    description: "hihi",
    point: 100
  },
  {
    id: 3,
    quantity: 20,
    description: "hihi",
    point: 100
  }
];

const Voucher = () => {
  const [list, setList] = useState(voucherData);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [newVoucher, setNewVoucher] = useState({ quantity: '', description: '', point: '' });

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

  const handleBlur = (voucherId) => {
    saveEdit(voucherId);
  };

  const handleKeyPress = (e, voucherId) => {
    if (e.key === 'Enter') {
      saveEdit(voucherId);
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
      const response = await axios.delete(`${url}/api/voucher/remove`, {
        data: { id: voucherId }
      });
      if (response.data.success) {
        toast.success(response.data.message);
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
      const response = await axios.get(`${url}/api/voucher/list`);
      if (response.data.success) {
        setList(response.data.vouchers);
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

  return (
    <div>
      <h1 style={{ marginLeft: '10px' }}>Voucher Management</h1>
      <div>
        <h2 style={{ marginLeft: '10px' }}>Add New Voucher</h2>
        <input
         style={{ marginRight: '10px',
          marginLeft: '40px',
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
          name="quantity"
          placeholder="Quantity"
          value={newVoucher.quantity}
          onChange={handleEditChange}
        />
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
          name="description"
          placeholder="Description"
          value={newVoucher.description}
          onChange={handleEditChange}
        />
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
          name="point"
          placeholder="Point"
          value={newVoucher.point}
          onChange={handleEditChange}
        />
        <button onClick={addVoucher} className='button-63'>Add Voucher</button>
      </div>

      <h2 style={{ marginLeft: '10px' }}>Voucher List</h2>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Description</b>
          <b>Point</b>
          <b>Quantity</b>
          <b>Actions</b> {/* Added an Actions header */}
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <p>{item.description}</p>
            <p>{item.point}</p>
            {editingVoucher === item.id ? (
              <input
                type="text"
                value={newVoucher.quantity}
                name="quantity"
                onChange={handleEditChange}
                onBlur={() => handleBlur(item.id)}
                onKeyPress={(e) => handleKeyPress(e, item.id)}
              />
            ) : (
              <p onClick={() => startEditing(item.id, item)}>{item.quantity}</p>
            )}
            <button onClick={() => removeVoucher(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Voucher;
