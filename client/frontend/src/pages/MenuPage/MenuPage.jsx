import React, { useState } from 'react';
import coffeeDetails from '../../../../backend/Fake_Data(to_be_deleted)/coffee_detail.json';
import FoodDetailModal from '../../components/FoodDetailModal/FoodDetailModal';
import MenuListItem from '../../components/MenuList/MenuListItem'; // Corrected import
import './MenuPage.css';

const MenuPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (id) => {
    const item = coffeeDetails.find((item) => item.id === id);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="menu-page">
    <h2 style={{ color: '#8B4513' }}>Menu</h2>
      <div className="menu-list">
        {coffeeDetails.map((item) => (
          <MenuListItem key={item.id} item={item} onClick={handleItemClick} />
        ))}
      </div>
      {selectedItem && (
        <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MenuPage;
