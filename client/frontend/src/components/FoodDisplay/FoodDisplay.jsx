import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import FoodDetailModal from '../FoodDetailModal/FoodDetailModal';
import { StoreContext } from '../../Context/StoreContext';

const FoodDisplay = () => {
  const { url } = useContext(StoreContext);
  const [foodItems, setFoodItems] = useState([]); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get(`${url}/product`);
        console.log('API response:', response.data); 
        if (response.data && Array.isArray(response.data.data)) {
          setFoodItems(response.data.data);
        } else if (Array.isArray(response.data)) {
          setFoodItems(response.data);
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
    console.log('Food item clicked:', id);
    const item = foodItems.find((item) => item._id === id);
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
        {foodItems.map((item) => (
          <div key={item._id}>
            <FoodItem
              image={item.imageURL} 
              name={item.name}
              desc={item.description}
              price={item.price}
              id={item._id}
              toppings={item.available_toppings} 
              onClick={() => handleItemClick(item._id)}
            />
          </div>
        ))}
      </div>
      {selectedItem && (
        <FoodDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FoodDisplay;
