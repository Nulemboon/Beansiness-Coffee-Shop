import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { url } from '../../assets/assets';
import './Toppings.css'
import axios from 'axios';

const Toppings = () => {
  const [list, setList] = useState([]);
  const [editingToppings, setEditingToppings] = useState(null);
  const [editToppingsDetails, setEditToppingsDetails] = useState({
    name: '',
    price: ''

  });
  const [newToppings, setNewToppings] = useState({
    name: '',
    price: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/topping`);
      if (response.status === 200) {
        setList(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the topping list.");
    }
  };

  const addToppings = async () => {
    try {
      const response = await axios.post(`${url}/topping`, newToppings);

      if (response.status === 200) {
        fetchList();
        setNewToppings({ name: '', price: '' });
        toast.success("Topping added successfully.");
      } else {
        toast.error("Failed to add topping.");
      }
    } catch (error) {
      console.error("There was an error adding the topping!", error);
      toast.error("Failed to add topping.");
    }
  };

  const removeToppings = async (toppingsId) => {
    try {
      const response = await axios.delete(`${url}/topping/${toppingsId}`);
      if (response.status === 200) {
        fetchList();
        toast.success("Topping removed successfully.");
      } else {
        toast.error("Failed to remove topping.");
      }
    } catch (error) {
      console.error("There was an error removing the topping!", error);
      toast.error("Failed to remove topping.");
    }
  };

  const startEditing = (topping) => {
    setEditingToppings(topping._id);
    setEditToppingsDetails({
      name: topping.name,
      price: topping.price
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditToppingsDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  

  const saveEdit = async (toppingsId) => {
    try {
      const response = await axios.put(`${url}/topping/${toppingsId}`, editToppingsDetails);
      if (response.status === 200) {
        fetchList();
        setEditingToppings(null);
        toast.success("Topping updated successfully.");
      } else {
        toast.error("Failed to update topping.");
      }
    } catch (error) {
      console.error("There was an error updating the topping!", error);
      toast.error("Failed to update topping.");
    }
  };
  

  const cancelEditing = () => {
    setEditingToppings(null);
  };

  const handleNewToppingsChange = (e) => {
    setNewToppings({ ...newToppings, [e.target.name]: e.target.value });
  };

  const handleNewToppingsSubmit = (e) => {
    e.preventDefault();
    addToppings();
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
    (toppings) =>
      toppings.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1>Topping Management</h1>

        <input
          style={{ marginLeft: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <form onSubmit={handleNewToppingsSubmit} className="new-user-form">
        <input
          style={{ marginLeft: '30px', marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="text"
          name="name"
          placeholder="Name"
          value={newToppings.name}
          onChange={handleNewToppingsChange}
          required
          className="user-input"
        />
        <input
          style={{ marginRight: '10px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#333', width: '180px', backgroundColor: '#fff', transition: 'border-color 0.3s ease' }}
          type="number"
          step="0.01"          
          name="price"
          placeholder="Price"
          value={newToppings.price}
          onChange={handleNewToppingsChange}
          required
          className="user-input"
        />
        <button type="submit" className='button-63'>Add Topping</button>

      </form>

      <div className='list-table'>
        <div className='list-table-format1 title'>
          <b>Topping name</b>
          <b>Price</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format-topping'>
            {editingToppings === item._id ? (
            <>
                <input
                type="text"
                name="name"
                value={editToppingsDetails.name}
                onChange={handleEditChange}
                className="user-input"
                />
                <input
                type="number"
                step="0.01"
                name="price"
                value={editToppingsDetails.price}
                onChange={handleEditChange}
                className="user-input"
                />
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
            </>
            ) : (
            <>
                <p>{item.name}</p>
                <p>{item.price}</p>
                <button className='buttonne' onClick={() => startEditing(item)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                </button>
                <button className='buttonne' onClick={() => removeToppings(item._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
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

export default Toppings;
