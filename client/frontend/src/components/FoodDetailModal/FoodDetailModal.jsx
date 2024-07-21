import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './FoodDetailModal.css';
import { StoreContext } from '../../Context/StoreContext';

const FoodDetailModal = ({ item, onClose }) => {
  const { url } = useContext(StoreContext);

  const {
    name = "Unnamed Item",
    imageURL,
    description = "No description available",
    price = 0,
    category = "Uncategorized",
    available_toppings = [],
    reviews = [],
  } = item;
  console.log('Item in Modal:', item); // Log item in the modal
  const [reviewDetails, setReviewDetails] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const reviewPromises = reviews.map(async (review) => {
          const userResponse = await axios.get(`${url}/account/${review.account_id}`);
          return {
            ...review,
            user: userResponse.data.name,
          };
        });
        const detailedReviews = await Promise.all(reviewPromises);
        setReviewDetails(detailedReviews);

        const avgRating = reviews.length
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
          : 0;
        setAverageRating(avgRating);
      } catch (error) {
        console.error('Error fetching review details:', error);
      }
    };

    fetchReviewDetails();
  }, [reviews, url]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div className='modal-overlay'>
      <div className='modal-content' style={{ width: '550px' }}>
        <span className='close-button' onClick={onClose}>&times;</span>
        <h2 style={{ color: '#6f4e37', display: 'flex', alignItems: 'center' }}>
  <span>{name}</span>
  {imageURL && (
    <img
      src={`${url}/images/${imageURL}`}
      alt={name}
      className='food-detail-image'
      style={{
        width: '200px', 
        height: 'auto',
        marginLeft: '10px',
        borderRadius: '10px',
      }}
    />
  )}
</h2>


        <p><strong style={{ color: '#6f4e37' }}>Description:</strong> {description}</p>
        <p><strong style={{ color: '#6f4e37' }}>Price:</strong> {price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
        <p><strong style={{ color: '#6f4e37' }}>Category:</strong> {category}</p>
        <p><strong style={{ color: '#6f4e37' }}>Available Toppings:</strong></p>
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
        <h3 style={{ color: '#6f4e37' }}>Reviews (Average Rating: {averageRating})</h3>
        <ul>
          {reviewDetails.length > 0 ? reviewDetails.map((review, index) => (
            <li key={index} className='review-item'>
              <p><strong>{review.user}:</strong> {review.review}</p>
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
            </li>
          )) : <p>No reviews available</p>}
        </ul>
      </div>
    </div>
  );
};

export default FoodDetailModal;
