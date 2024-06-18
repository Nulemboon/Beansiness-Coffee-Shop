import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import FoodDetailModal from '../FoodDetailModal/FoodDetailModal';

const FoodDisplay = ({ category }) => {
  //const { url } = useContext(StoreContext); 
  const [foodItems, setFoodItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        let new_url = url;
        new_url += "/product/all";
        const response = await axios.get(new_url);
        setFoodItems(response.data); 
      } catch (err) {
        setError('Failed to load food items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

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
    <div className='food-display' id='food-display'>
      <h2 style={{ color: '#8B4513' }}>Top drinks near you</h2>
      <div className='food-display-list'>
        {foodItems.map((item) => {
          if (category === "All" || category === item.category) {
            return (
              <div key={item.id}>
                <FoodItem
                  image={item.image_url}
                  name={item.name}
                  desc={item.description}
                  price={item.price}
                  id={item.id}
                  onClick={() => handleItemClick(item.id)} 
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      {selectedItem && <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />}
    </div>
  );
};

export default FoodDisplay;
