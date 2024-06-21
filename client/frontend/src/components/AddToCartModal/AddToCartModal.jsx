import React, { useState } from 'react';
import './AddToCartModal.css';

const AddToCartModal = ({ isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [toppings, setToppings] = useState([]);

  if (!isOpen) return null;

  const handleToppingChange = (topping) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, size, toppings);
    onClose(); 
  };

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Customize your order</h2>
        <div className='modal-field'>
          <label>Quantity:</label>
          <input
            type='number'
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min='1'
          />
        </div>
        <div className='modal-field'>
          <label>Size:</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value='S'>Small</option>
            <option value='M'>Medium</option>
            <option value='L'>Large</option>
          </select>
        </div>
        <div className='modal-field'>
          <label>Toppings:</label>
          <div className='toppings-options'>
            {['Topping1', 'Topping2', 'Topping3'].map((topping) => (
              <label key={topping}>
                <input
                  type='checkbox'
                  value={topping}
                  checked={toppings.includes(topping)}
                  onChange={() => handleToppingChange(topping)}
                />
                {topping}
              </label>
            ))}
          </div>
        </div>
        <button className='add-to-cart-button' onClick={handleAddToCart}>Add to Cart</button>
        <button className='cancel1-button' onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddToCartModal;
