import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import ChangePassword from './components/ChangePassword/ChangePassword';
import VoucherSite from './components/VoucherSite/VoucherSite';
import ReviewForm from './components/WriteReview/ReviewForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuPage from './pages/MenuPage/MenuPage';
import UserInformation from './components/UserInformation/UserInformation';
import DeliveryForm from './components/DeliveryForm/DeliveryForm';
import Result from './pages/Result/Result';
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <ToastContainer />
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className='app'>
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/placeorder' element={<PlaceOrder />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/vouchersite' element={<VoucherSite />} /> {/*for testing */}
            <Route path='/menupage' element={<MenuPage />} /> {/*for testing */}
            <Route path='/userinfo' element={<UserInformation />} />
            <Route path='/deliveryform' element={<DeliveryForm />} />
            <Route path='/order/vnpay_return' element={<Result />} />
          </Routes>
        </div>
        <Footer />
      </CookiesProvider>
    </>
  );
}

const StaffRoute = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (localStorage.getItem('role') !== 'onsite') {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />;
}

const ShipRoute = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (localStorage.getItem('role') !== 'shipper') {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />;
}

export default App;
