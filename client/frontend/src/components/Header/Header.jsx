import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2>Order your favourite coffee here</h2>
        <p>Khách hàng là thượng đế!</p>
        <Link to="/menupage">
          <button >View Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
