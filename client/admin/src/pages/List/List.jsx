import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newDetails, setNewDetails] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageURL: '',
    available_toppings: ''
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/product/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching the product list.");
      }
    } catch (error) {
      toast.error("Error fetching the product list.");
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(`${url}/product/${productId}`)
      await fetchList();
      if (response.status == 200) {
        toast.success("Successfully remove the product");
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
      imageURL: product.imageURL,
      available_toppings: (product.available_toppings || []).join(', ')
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setNewDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const saveEdit = async (productId) => {
    try {
      const response = await axios.put(`${url}/product`, {
        productId, // Update the key to productId
        ...newDetails,
        available_toppings: newDetails.available_toppings.split(',').map(topping => topping.trim())
      });
      if (response.status === 200) {
        toast.success("Sucessful roi neeee");
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

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Products List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Available Toppings</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            {editingProduct === item._id ? (
              <>
                <input
                  type="text"
                  name="imageURL"
                  value={newDetails.imageURL}
                  onChange={handleEditChange}
                  placeholder="Image URL"
                  autoFocus
                />
                <input
                  type="text"
                  name="name"
                  value={newDetails.name}
                  onChange={handleEditChange}
                  placeholder="Product Name"
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
                <input
                  type="text"
                  name="available_toppings"
                  value={newDetails.available_toppings}
                  onChange={handleEditChange}
                  placeholder="Available Toppings (comma separated)"
                />
                <button onClick={() => saveEdit(item._id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <img src={item.imageURL} alt="" />
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p>{(item.available_toppings || []).join(', ')}</p>
                <p onClick={() => startEditing(item)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg></p>
                <p className='cursor' onClick={() => removeProduct(item._id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg></p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
