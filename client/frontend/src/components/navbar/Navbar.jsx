import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setMenu("home");
        break;
      case "/menupage":
        setMenu("menu");
        break;
      case "/contact":
        setMenu("contact");
        break;
      case "/vouchersite":
        setMenu("myvouchers");
        break;
      default:
        setMenu("");
    }
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/');
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="Logo" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <Link to="/menupage" onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</Link>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
        {localStorage.getItem('role') === "Shipper" && <Link to="/ship/order" onClick={() => setMenu("ship")} className={`${menu === "ship" ? "active" : ""}`}>shipment</Link>}
        {localStorage.getItem('role') === "Onsite" && <Link to="/staff/order" onClick={() => setMenu("staff")} className={`${menu === "staff" ? "active" : ""}`}>staff</Link>}
        {token && (
          <Link to="/vouchersite" onClick={() => setMenu("myvouchers")} className={`${menu === "myvouchers" ? "active" : ""}`}>my vouchers</Link>
        )}
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" />
        {token && (
          <>
            <Link to='/cart' className='navbar-search-icon'>
              <img src={assets.basket_icon} alt="Cart" />
              <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
            </Link>
            <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="Profile" />
              <ul className='navbar-profile-dropdown'>
              <Link to= '/userinfo'>
                <li> <img src={assets.profile_icon} alt="Profile" /> <p>Profile</p></li>
                </Link>
                <hr />
                <Link to='/myorders'>
                  <li> <img src={assets.bag_icon} alt="Orders" /> <p>Orders</p></li>
                </Link>
                <hr />
                <li onClick={logout}> <img src={assets.logout_icon} alt="Logout" /> <p>Logout</p></li>
              </ul>
            </div>
          </>
        )}
        {!token && (
          <button onClick={() => setShowLogin(true)}>sign up</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;