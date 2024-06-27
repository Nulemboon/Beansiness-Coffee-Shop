import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/staff/order/' className="sidebar-option">
            <img src={assets.basket_icon} alt="" />
            <p>Offline Order</p>
        </NavLink>
        <NavLink to='/staff/confirm' className="sidebar-option">
            <img src={assets.parcel_icon} alt="" />
            <p>Order</p>
        </NavLink>
        <NavLink to='/staff/register' className="sidebar-option">
          <img src={assets.profile_icon} alt="" />
          <p>New Member</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
