import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodDetailModal from '../../components/FoodDetailModal/FoodDetailModal';
import MenuListItem from '../../components/MenuList/MenuListItem';
import './MenuPage.css';
import { StoreContext } from '../../Context/StoreContext'; // Adjust the path based on your project structure

const MenuPage = () => {
  const { url } = useContext(StoreContext); // Access url from StoreContext
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${url}/product/all`);
        setFoodItems(response.data); // Assuming the API returns an array of food items
      } catch (err) {
        setError('Failed to load food items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [url]); // Dependency array includes url to ensure it updates if url changes

  const handleItemClick = (id) => {
    const item = foodItems.find((item) => item.id === id);
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
            key={item.id}
            item={item}
            onClick={() => handleItemClick(item.id)}
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
