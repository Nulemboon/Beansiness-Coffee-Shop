import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

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
      const response = await axios.post(`${url}/api/product/remove`, {
        id: productId
      });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing the product.");
      }
    } catch (error) {
      toast.error("Error removing the product.");
    }
  };

  const startEditing = (productId, currentPrice) => {
    setEditingProduct(productId);
    setNewPrice(currentPrice);
  };

  const handleEditChange = (e) => {
    setNewPrice(e.target.value);
  };

  const saveEdit = async (productId) => {
    try {
      const response = await axios.put(`${url}/api/product/edit`, {
        id: productId,
        price: newPrice
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setEditingProduct(null);
      } else {
        toast.error("Error updating the product.");
      }
    } catch (error) {
      toast.error("Error updating the product.");
    }
  };

  const handleBlur = (productId) => {
    saveEdit(productId);
  };

  const handleKeyPress = (e, productId) => {
    if (e.key === 'Enter') {
      saveEdit(productId);
    }
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
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {editingProduct === item._id ? (
                <input
                  type="text"
                  value={newPrice}
                  onChange={handleEditChange}
                  onBlur={() => handleBlur(item._id)}
                  onKeyPress={(e) => handleKeyPress(e, item._id)}
                  autoFocus
                />
              ) : (
                <span onClick={() => startEditing(item._id, item.price)}>
                  ${item.price}
                </span>
              )}
            </p>
            <p className='cursor' onClick={() => removeProduct(item._id)}>x</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
