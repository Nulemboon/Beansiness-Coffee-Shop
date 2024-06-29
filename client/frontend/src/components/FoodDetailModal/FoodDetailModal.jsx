import React, { useContext} from 'react';
import './FoodDetailModal.css';
import { StoreContext } from '../../Context/StoreContext';

const FoodDetailModal = ({ item, onClose }) => {
  const { url } = useContext(StoreContext);

  const {
    name = "Unnamed Item",
    image,
    description = "No description available",
    price = 0,
    category = "Uncategorized",
    available_toppings = [],
    reviews = [],
  } = item;

  return (
    <div className='modal-overlay'>
      <div className='modal-content' style={{ width: '550px' }}>
        <span className='close-button' onClick={onClose}>&times;</span>
        <h2>{name}</h2>
        {image && <img src={`${url}/images/${item.imageURL}`} alt={name} className='food-detail-image' />}
        <div className="food-details">
          <div className="detail-section">
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Price:</strong> {price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
            <p><strong>Category:</strong> {category}</p>
          </div>
          <div className="detail-section">
            <p><strong>Available Toppings:</strong></p>
            {available_toppings.length > 0 ? (
              <ul>
                {available_toppings.map((topping) => (
                  <li key={topping._id}>
                    {topping.name} (+{topping.price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No toppings available</p>
            )}
          </div>
        </div>
        <h3>Reviews</h3>
        <ul>
          {reviews.length > 0 ? reviews.map((review, index) => (
            <li key={index}>
              <p><strong>{review.user}:</strong> {review.comment}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
            </li>
          )) : <p>No reviews available</p>}
        </ul>
      </div>
    </div>
  );
};

export default FoodDetailModal;