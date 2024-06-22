import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Verify from './pages/Verify/Verify';
import Result from './pages/Result/Result';
import ChangePassword from './components/ChangePassword/ChangePassword';
import VoucherSite from './components/VoucherSite/VoucherSite';
import ReviewForm from './components/WriteReview/ReviewForm'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuPage from './pages/MenuPage/MenuPage';
import UserInformation from './components/UserInformation/UserInformation';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/order/vnpay_return' element={<Result />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/vouchersite' element={<VoucherSite />} /> {/*for testing */}
          <Route path='/menupage' element={<MenuPage />} /> {/*for testing */}
          <Route path='userinfo' element={<UserInformation />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
