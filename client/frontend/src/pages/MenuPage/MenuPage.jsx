import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodDetailModal from '../../components/FoodDetailModal/FoodDetailModal';
import MenuListItem from '../../components/MenuList/MenuListItem';
import AddToCartModal from '../../components/AddToCartModal/AddToCartModal';
import './MenuPage.css';
import { StoreContext } from '../../Context/StoreContext'; 

const MenuPage = () => {
  const { url } = useContext(StoreContext);
  const [foodItems, setFoodItems] = useState([]); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [isFoodDetailModalOpen, setFoodDetailModalOpen] = useState(false); // New state for FoodDetailModal

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${url}/product`);
        console.log('API response:', response.data); 

        if (Array.isArray(response.data)) {
          setFoodItems(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setFoodItems(response.data.data);
        } else {
          throw new Error('API did not return an array');
        }
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load food items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [url]); 

  const handleItemClick = (id) => {
    const item = foodItems.find((item) => item._id === id); 
    setSelectedItem(item);
    setFoodDetailModalOpen(true); // Open FoodDetailModal
  };

  const handleAddToCartClick = (item) => {
    setSelectedItem(item);
    setAddToCartModalOpen(true); // Open AddToCartModal
    setFoodDetailModalOpen(false); // Close FoodDetailModal if it was open
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setAddToCartModalOpen(false);
    setFoodDetailModalOpen(false);
  };

  const handleAddToCart = (quantity, size, toppings) => {
    console.log('Adding to cart:', { item: selectedItem, quantity, size, toppings });
    setAddToCartModalOpen(false);
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
            onAddToCartClick={() => handleAddToCartClick(item)} 
          />
        ))}
      </div>
      {selectedItem && isFoodDetailModalOpen && (
        <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
      {selectedItem && isAddToCartModalOpen && (
        <AddToCartModal
          isOpen={isAddToCartModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default MenuPage;
