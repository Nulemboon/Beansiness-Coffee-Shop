import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './OfflineDetail.css';
import { url } from '../../assets/assets';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const OfflineDetail = ({ product, onClose }) => {
  const [availableToppings, setAvailableToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${url}/product/${product._id}`);
        if (response.data.success) {
          setAvailableToppings(response.data.available_toppings);
        } else {
          toast.error('Failed to fetch product details');
        }
      } catch (error) {
        toast.error('Error fetching product details');
      }
    };

    fetchProductDetails();
  }, [product._id]);

  const handleToppingChange = (e) => {
    const value = e.target.value;
    setSelectedToppings((prevToppings) =>
      prevToppings.includes(value)
        ? prevToppings.filter((topping) => topping !== value)
        : [...prevToppings, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      product: product.name,
      toppings: selectedToppings,
    });
    Cookies.set('cart', JSON.stringify({
      _id: product._id,
      quantity: 1,
      toppings: selectedToppings,
    }), { expires: 7 });

    onClose(); // Close the modal or component
  };

  return (
    <div className='offline-detail-overlay'>
      <div className='offline-detail-container'>
        <button className='close-button' onClick={onClose}>X</button>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Toppings:</label>
            {availableToppings.map((topping) => (
              <div key={topping.name}>
                <input
                  type='checkbox'
                  id={topping.name}
                  value={topping.name}
                  checked={selectedToppings.includes(topping.name)}
                  onChange={handleToppingChange}
                />
                <label htmlFor={topping.name}>{topping.name} - {topping.price}</label>
              </div>
            ))}
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

OfflineDetail.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OfflineDetail;