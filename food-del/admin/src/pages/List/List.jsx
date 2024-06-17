import React, { useEffect, useState } from 'react';
import './List.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, {
      id: foodId
    });
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const startEditing = (foodId, currentPrice) => {
    setEditingFood(foodId);
    setNewPrice(currentPrice);
  };

  const handleEditChange = (e) => {
    setNewPrice(e.target.value);
  };

  const saveEdit = async (foodId) => {
    const response = await axios.post(`${url}/api/food/edit`, {
      id: foodId,
      price: newPrice
    });
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchList();
      setEditingFood(null);
    } else {
      toast.error("Error");
    }
  };

  const handleBlur = (foodId) => {
    saveEdit(foodId);
  };

  const handleKeyPress = (e, foodId) => {
    if (e.key === 'Enter') {
      saveEdit(foodId);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {editingFood === item._id ? (
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
              <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;