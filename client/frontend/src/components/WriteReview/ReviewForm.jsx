import React, { useState, useContext } from 'react';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const ReviewForm = ({ item, onClose }) => {
  const { url } = useContext(StoreContext);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting review for product ID:', item.product_id._id);
      const response = await axios.post(`${url}/product/add-review/${item.product_id._id}`, {
        review,
        rating
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data.message);
      onClose();
      toast.success("Submitted your review");
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.error || 'An error occurred while submitting your review.');
    }
  };

  console.log('Item:', item);
  console.log(item.product_id.imageURL);
  return (
    <div className="review-form-container">
      <h3>Write a Review for {item.product_id.name}</h3>
      {item.product_id.imageURL && (
    <div className="product-image">
      <img 
        src={`${url}/images/${item.product_id.imageURL}`}
        alt={item.product_id.name} 
        style={{ width: '150px', height: 'auto', marginBottom: '10px', borderRadius: '10px'}} 
      />
    </div>
  )}
      {error && <p className="error">{error}</p>}
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="review-text">Review:</label>
          <textarea
            id="review-text"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="review-rating">Rating:</label>
          <input
            id="review-rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            placeholder="1-5"
            required
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '16px',
              width: '100px',
              backgroundColor: '#f0f8ff',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button style={{ padding: '10px 20px', width: '145px',fontSize: '16px', color: '#fff', backgroundColor: '#6f4e37', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} type="submit">
            Submit Review
          </button>
          <button style={{ padding: '10px 20px', width: '145px', fontSize: '16px', color: '#6f4e37', backgroundColor: '#fff', border: '2px solid #6f4e37', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease, color 0.3s ease' }} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>


      </form>
    </div>
  );
};

export default ReviewForm;
