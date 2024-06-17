import React, { useState } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import FoodDetailModal from '../FoodDetailModal/FoodDetailModal';
import coffeeDetails from '../../../../backend/Fake_Data(to_be_deleted)/coffee_detail.json';

const FoodDisplay = ({ category }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (id) => {
    const item = coffeeDetails.find((item) => item.id === id);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className='food-display' id='food-display'>
      <h2 style={{ color: '#8B4513' }}>Top drinks near you</h2>
      <div className='food-display-list'>
        {coffeeDetails.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <div key={item.id} onClick={() => handleItemClick(item.id)}>
                <FoodItem image={item.image_url} name={item.name} desc={item.description} price={item.price} id={item.id} />
              </div>
            );
          }
        })}
      </div>
      {selectedItem && <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  );
};

export default FoodDisplay;



