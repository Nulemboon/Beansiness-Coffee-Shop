import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newDetails, setNewDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageFile: null,
    available_toppings: []
  });
  const [availableToppings, setAvailableToppings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/product`);
      if (response.status === 200) {
        setList(response.data);
        setFilteredList(response.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching the product list.");
    }
  };

  const fetchToppings = async () => {
    try {
      const response = await axios.get(`${url}/topping`);
      if (response.status === 200) {
        setAvailableToppings(response.data);
      } else {
        toast.error("Error fetching the toppings list.");
      }
    } catch (error) {
      toast.error("Error fetching the toppings list.");
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(`${url}/product/${productId}`);
      await fetchList();
      if (response.status === 200) {
        toast.success("Successfully removed the product.");
      } else {
        toast.error("Error removing the product.");
      }
    } catch (error) {
      toast.error("Error removing the product.");
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setNewDetails({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageFile: null,
      available_toppings: product.available_toppings ? product.available_toppings.map(topping => topping._id) : []
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleToppingsChange = (e) => {
    const { value, checked } = e.target;
    setNewDetails(prevDetails => {
      const available_toppings = checked
        ? [...prevDetails.available_toppings, value]
        : prevDetails.available_toppings.filter(topping => topping !== value);
      return {
        ...prevDetails,
        available_toppings
      };
    });
  };

  const handleImageChange = (e) => {
    setNewDetails(prevDetails => ({
      ...prevDetails,
      imageFile: e.target.files[0]
    }));
  };

  const saveEdit = async (productId) => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('name', newDetails.name);
    formData.append('description', newDetails.description);
    formData.append('price', newDetails.price);
    formData.append('category', newDetails.category);
    newDetails.available_toppings.forEach(topping => {
      formData.append("toppings[]", topping);
    });
        if (newDetails.imageFile) {
      formData.append('image', newDetails.imageFile);
    }

    try {
      const response = await axios.put(`${url}/product`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        toast.success("Successfully updated the product.");
        await fetchList();
        setEditingProduct(null);
      } else {
        toast.error("Error updating the product.");
      }
    } catch (error) {
      toast.error("Error updating the product.");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterList(query);
  };

  const filterList = (query) => {
    if (!query) {
      setFilteredList(list);
    } else {
      const filtered = list.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.available_toppings.some(topping => topping.name.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredList(filtered);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  useEffect(() => {
    fetchList();
    fetchToppings();
  }, []);

  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className='list add flex-col'>
      <p>All Products List</p>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Available Toppings</b>
        </div>
        {paginatedList.map((item, index) => (
          <div key={index} className='list-table-format'>
            {editingProduct === item._id ? (
              <>
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleImageChange}
                />
                <input
                  type="text"
                  name="name"
                  value={newDetails.name}
                  onChange={handleEditChange}
                  placeholder="Product Name"
                  autoFocus
                />
                <input
                  type="text"
                  name="description"
                  value={newDetails.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                />
                <input
                  type="text"
                  name="category"
                  value={newDetails.category}
                  onChange={handleEditChange}
                  placeholder="Category"
                />
                <input
                  type="text"
                  name="price"
                  value={newDetails.price}
                  onChange={handleEditChange}
                  placeholder="Price"
                />
                <div>
                  {availableToppings.map(topping => (
                    <div key={topping._id}>
                      <input
                        type="checkbox"
                        id={topping._id}
                        value={topping._id}
                        checked={newDetails.available_toppings.includes(topping._id)}
                        onChange={handleToppingsChange}
                      />
                      <label htmlFor={topping._id}>{topping.name}</label>
                    </div>
                  ))}
                </div>
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <img src={item.imageURL} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p>{item.available_toppings ? item.available_toppings.map(topping => topping.name).join(', ') : ''}</p>
                <p onClick={() => startEditing(item)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </p>
                <p className='cursor' onClick={() => removeProduct(item._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default List;
