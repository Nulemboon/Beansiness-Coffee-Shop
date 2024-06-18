import './App.css';
// import React from 'react';
import Navbar from './components/navbar/Navbar'
import StaffOrder from './pages/StaffOrder/StaffOrder'
import StaffConfirm from './pages/StaffConfirm/StaffConfirm'
import ShipperConfirm from './pages/ShipperConfirm/ShipperConfirm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer/>
        <Navbar/>
        <hr />
        <Routes>
          <Route path="/staff-order" element={<StaffOrder/>}/>
          <Route path="/confirm-order/staff" element={<StaffConfirm/>}/>
          <Route path="/confirm-order/shipper" element={<ShipperConfirm/>}/>
        </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
