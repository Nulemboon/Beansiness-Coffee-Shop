// App.js
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './pages/User/User';
import Voucher from './pages/Voucher/Voucher';
import FinancialReport from './pages/FinancialReport/FinancialReport';
import Staff from './pages/Staff/Staff';
import Login from './pages/Login/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className='app'>
      <ToastContainer />
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <hr />
      <div className="app-content">
        {isAuthenticated && <Sidebar />}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          {isAuthenticated ? (
            <>
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/vouchers" element={<Voucher />} />
              <Route path="/report" element={<FinancialReport />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="*" element={<Navigate to="/list" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
