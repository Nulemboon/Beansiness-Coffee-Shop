// import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/staff-order' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Offline Order</p>
        </NavLink>
        <NavLink to='/confirm-order/staff' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Order</p>
        </NavLink>
        <NavLink to='/confirm-order/shipper' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Order</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
