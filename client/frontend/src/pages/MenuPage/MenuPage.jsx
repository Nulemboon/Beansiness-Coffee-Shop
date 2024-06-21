import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodDetailModal from '../../components/FoodDetailModal/FoodDetailModal';
import MenuListItem from '../../components/MenuList/MenuListItem';
import './MenuPage.css';
import { StoreContext } from '../../Context/StoreContext'; 
const MenuPage = () => {
  const { url } = useContext(StoreContext); // Access url from StoreContext
  const [foodItems, setFoodItems] = useState([]); // Initialize as an empty array
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${url}/product`);
        console.log('API response:', response.data); // Debugging log

        if (Array.isArray(response.data)) {
          setFoodItems(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setFoodItems(response.data.data);
        } else {
          throw new Error('API did not return an array');
        }
      } catch (err) {
        console.error('Error fetching food items:', err); // Debugging log
        setError('Failed to load food items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [url]); // Dependency array includes url to ensure it updates if url changes

  const handleItemClick = (id) => {
    const item = foodItems.find((item) => item._id === id); // Use `_id` instead of `id`
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="menu-page">
      <h2 style={{ color: '#8B4513' }}>Menu</h2>
      <div className="menu-list">
        {foodItems.map((item) => (
          <MenuListItem
            key={item._id}
            item={item}
            onClick={() => handleItemClick(item._id)} 
          />
        ))}
      </div>
      {selectedItem && (
        <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MenuPage;
