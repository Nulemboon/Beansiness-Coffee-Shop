import React, { useState } from 'react';
import './AddToCartModal.css';

const AddToCartModal = ({ isOpen, onClose, onAddToCart, toppings }) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [selectedToppings, setSelectedToppings] = useState([]);

  if (!isOpen) return null;

  const handleToppingChange = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    onAddToCart(quantity, size, selectedToppings);
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
            {toppings.map((topping) => (
              <label key={topping._id}>
                <input
                  type='checkbox'
                  value={topping.name}
                  checked={selectedToppings.includes(topping.name)}
                  onChange={() => handleToppingChange(topping.name)}
                />
                {topping.name} (+{topping.price} VND)
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
