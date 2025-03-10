import React from 'react'
import  './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/users' className="sidebar-option">
            <img src={assets.user_icon} alt="" />
            <p>Users</p>
        </NavLink>
        <NavLink to='/vouchers' className="sidebar-option">
            <img src={assets.voucher_icon} alt="" />
            <p>Vouchers</p>
        </NavLink>
        <NavLink to='/report' className="sidebar-option">
            <img src={assets.report_icon} alt="" />
            <p>Financial Report</p>
        </NavLink>
        <NavLink to='/staff' className="sidebar-option">
            <img src={assets.staff_icon} alt="" />
            <p>Staff</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
