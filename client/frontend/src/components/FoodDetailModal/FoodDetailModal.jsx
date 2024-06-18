import React from 'react';
import './FoodDetailModal.css';

const FoodDetailModal = ({ item, onClose }) => {
  return (
    <div className='modal-overlay'>
      <div className='modal-content' style={{ width: '550px' }}>       
        <span className='close-button' onClick={onClose}>&times;</span>
        <h2>{item.name}</h2>
        <img src={item.image} alt={item.name} />
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Price:</strong> ${item.price}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Available Toppings:</strong> {item.availableToppings.join(', ')}</p>
        <p><strong>Rating:</strong> {item.rating}</p>
        <h3>Reviews</h3>
        <ul>
          {item.reviews.map((review, index) => (
            <li key={index}>
              <p><strong>{review.user}:</strong> {review.comment}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FoodDetailModal;
