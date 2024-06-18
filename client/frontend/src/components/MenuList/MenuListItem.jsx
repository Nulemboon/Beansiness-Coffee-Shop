import React from 'react';
import './MenuListItem.css'; 

const MenuListItem = ({ item, onClick }) => {
  return (
    <div className="menu-list-item" onClick={() => onClick(item.id)}>
      <div className="menu-list-item-image">
        <img src={item.image_url} alt={item.name} />
      </div>
      <div className="menu-list-item-details">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MenuListItem;
