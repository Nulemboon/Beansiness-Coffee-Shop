import React, { useContext} from 'react';
import './MenuListItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const MenuListItem = ({ item, onClick, onAddToCartClick }) => {
  const { token, url } = useContext(StoreContext);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Please sign in first to add items to your cart.', {
        position: 'top-right',
        autoClose: 3000 
      });
      return;
    }
    onAddToCartClick(item);
  };

  return (
    <div className="menu-list-item">
      <div className="menu-list-item-content" onClick={() => onClick(item._id)}>
        <div className="menu-list-item-image">
          <img src={`${url}/images/${item.imageURL}`} alt={item.name} />
        </div>
        <div className="menu-list-item-details">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>{item.price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
        </div>
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <img src={assets.add_icon_white} alt="Add to cart" />
      </button>
    </div>
  );  
};

export default MenuListItem;
