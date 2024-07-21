import React, { useState } from 'react';
import './AddToCartModal.css';

const AddToCartModal = ({ isOpen, onClose, onAddToCart, toppings, price }) => {
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
    const toppingCost = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find(t => t._id === toppingId);
      return total + (topping ? topping.price : 0);
    }, 0);
    const totalPrice = price + toppingCost;

    const selectedToppingObjects = selectedToppings.map(toppingId => {
      return toppings.find(t => t._id === toppingId);
    });

    onAddToCart(quantity, size, selectedToppingObjects, totalPrice);
    onClose();
  };

  
  return (
    <div className='modal-overlay' onClick={onClose}>
<div className='modal-content' onClick={(e) => e.stopPropagation()} style={{ height: '300px'}}>       
        <br></br>
        <div className='modal-field'>
          <label id="label-quantity">Quantity:</label>
          <input
            type='number'
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min='1'
          />
        </div>
        <div className='modal-field'>
          <label id="label-size">Size: </label>
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
              <label className="topping-label" key={topping._id}>
                <input
                  type='checkbox'
                  value={topping._id}
                  checked={selectedToppings.includes(topping._id)}
                  onChange={() => handleToppingChange(topping._id)}
                />
                {topping.name} (+{topping.price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })})
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
