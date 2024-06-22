import React, { useState } from 'react';
import { Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/LoginPopup/LoginPopup';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Verify from './pages/Verify/Verify';
import Result from './pages/Result/Result';
import StaffOrder from './pages/StaffOrder/StaffOrder';
import StaffConfirm from './pages/StaffConfirm/StaffConfirm';
import ShipperConfirm from './pages/ShipperConfirm/ShipperConfirm';
import ChangePassword from './components/ChangePassword/ChangePassword';
import VoucherSite from './components/VoucherSite/VoucherSite';
import ReviewForm from './components/WriteReview/ReviewForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterOffline from './pages/RegisterOffline/RegisterOffline';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState({
    name: "John",
    role: "onsite",
  });

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        {showLogin && <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />}
        <div className='app'>
          <Navbar setShowLogin={setShowLogin} user={user} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/order/vnpay_return' element={<Result />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/vouchersite' element={<VoucherSite />} />
            <Route path='/menupage' element={<MenuPage />} />
            <Route path='/staff' element={<StaffRoute user={user} />}>
              <Route path='/staff/order' element={<StaffOrder user={user} />} />
              <Route path='/staff/order/confirm' element={<StaffConfirm user={user} />} /> 
            </Route>
            <Route path='/ship' element={<ShipRoute user={user} />}>
              <Route path='/ship/order' element={<ShipperConfirm user={user} />} />
            </Route>            
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
}

const StaffRoute = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (user.role !== 'onsite') {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />;
}

const ShipRoute = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (user.role !== 'ship') {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />;
}

export default App;
