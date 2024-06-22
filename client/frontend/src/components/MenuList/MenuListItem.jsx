// MenuListItem.js

import React from 'react';
import './MenuListItem.css';
import { assets } from '../../assets/assets';

const MenuListItem = ({ item, onClick, onAddToCartClick }) => {
  return (
    <div className="menu-list-item">
      <div className="menu-list-item-content" onClick={() => onClick(item._id)}>
        <div className="menu-list-item-image">
          <img src={item.image_url} alt={item.name} />
        </div>
        <div className="menu-list-item-details">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>{item.price + ' VND'}</p>
        </div>
      </div>
      <button className="add-to-cart-btn" onClick={(e) => {
        e.stopPropagation(); // Prevents triggering the parent div click event
        onAddToCartClick(item);
      }}>
        <img src={assets.add_icon_green} alt="Add to cart" />
      </button>
    </div>
  );
};

export default MenuListItem;
