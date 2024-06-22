import React, { useState, useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import AddToCartModal from '../AddToCartModal/AddToCartModal'; 

const FoodItem = ({ image, name, price, desc, id, toppings, onClick }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); 
    setIsModalOpen(true);
    console.log('Add to cart button clicked');
  };

  const handleAddToCart = (quantity, size, selectedToppings) => {
    addToCart(id, quantity, size, selectedToppings);
    setIsModalOpen(false);
  };

  return (
    <div className='food-item' onClick={onClick}>
      <div className='food-item-img-container'>
        <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        {!cartItems[id] ? (
          <img
            className='add'
            onClick={handleAddToCartClick} 
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img src={assets.remove_icon_red} onClick={(e) => {
              e.stopPropagation();
              removeFromCart(id);
            }} alt="Remove from cart" />
            <p>{cartItems[id].quantity}</p>
            <img src={assets.add_icon_green} onClick={handleAddToCartClick} alt="Add more to cart" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">{price + ' VND'}</p>
      </div>
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        toppings={toppings} 
      />
    </div>
  );
};

export default FoodItem;
