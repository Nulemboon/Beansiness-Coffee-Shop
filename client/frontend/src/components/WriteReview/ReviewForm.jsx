import React, { useState, useContext } from 'react';
import axios from 'axios';
import './ReviewForm.css'; 
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const ReviewForm = ({ foodItemId, onClose }) => {
  const { url } = useContext(StoreContext);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/reviews/${foodItemId}`, {
        rating,
        reviewText
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        toast.success('Review submitted successfully');
        setReviewText('');
        setRating(5);
        onClose();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting the review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container-review'>
      <div className="review-form-container">
        <button onClick={onClose} className="close-button">×</button>
        <h2>Write a Food Review</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reviewText">Review:</label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
