import React from 'react';
import './FoodDetailModal.css';

const FoodDetailModal = ({ item, onClose }) => {
  // Default values or fallbacks
  const {
    name = "Unnamed Item",
    image, // Assuming there could be an image property
    description = "No description available",
    price = 0,
    category = "Uncategorized",
    available_toppings = [], // Fixed the key to match the provided data
    reviews = [],
    _id
  } = item;

  return (
    <div className='modal-overlay'>
      <div className='modal-content' style={{ width: '550px' }}>       
        <span className='close-button' onClick={onClose}>&times;</span>
        <h2>{name}</h2>
        {image && <img src={image} alt={name} />} {/* Only render the image if it exists */}
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Price:</strong> ${price / 100} {/* Assuming price is in cents */}</p>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Available Toppings:</strong> {available_toppings.length > 0 ? available_toppings.join(', ') : 'No toppings available'}</p>
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
