import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './OfflineDetail.css';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
// import { useCookies } from 'react-cookie';

const OfflineDetail = ({ product, onClose }) => {
  const [availableToppings, setAvailableToppings] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  // const [cookies, setCookie, removeCookie, remove] = useCookies(['cart']);
  const { url } = useContext(StoreContext);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${url}/product/${product._id}`);
        if (response.data && Array.isArray(response.data.available_toppings)) {
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

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post(`${url}/cart`, {
        productId: product._id,
        quantity: 1,
        size: selectedSize,
        toppings: availableToppings.filter(topping => selectedToppings.includes(topping.name)),
      }, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        toast.success('Product added');
        setSelectedSize('M');
      } else {
        toast.error(response.data.message); // Show error message if adding fails
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }

    onClose(); // Close the modal or component
  };

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  return (
    <div className='offline-detail-overlay'>
      <div className='offline-detail-container'>
        <button className='close-buttons' onClick={onClose}>X</button>
        <h2>{product.name}</h2> <br/>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> {product.price}đ</p> <br />
        <form onSubmit={handleSubmit}>
          <div className='form-container'>
            <div className='column'>
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
                  <label htmlFor={topping.name}>
                    {topping.name} - {topping.price}đ
                  </label>
                </div>
              ))}
            </div>
            <div className='column'>
              <label>Size:</label>
              <div>
                <input
                  type='radio'
                  id='sizeM'
                  name='size'
                  value='M'
                  checked={selectedSize === 'M'}
                  onChange={handleSizeChange}
                />
                <label htmlFor='sizeM'>M</label>
              </div>
              <div>
                <input
                  type='radio'
                  id='sizeL'
                  name='size'
                  value='L'
                  checked={selectedSize === 'L'}
                  onChange={handleSizeChange}
                />
                <label htmlFor='sizeL'>L (+5000đ)</label>
              </div>
            </div>
            <button type='submit'>Add</button>
          </div>
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