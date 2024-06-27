import React, { useContext, useEffect, useState } from 'react';
import './StaffConfirm.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';

const StaffConfirm = ({ user }) => {
  const { url } = useContext(StoreContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/order/pending`);
      console.log(response);
      if (response.data) {
        setList(response.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders");
    }
  }

  const handleConfirm = async (HID) => {
    try {
      const response = await axios.post(`${url}/order/approve/${HID}`);
      if (response.status === 200) {
        toast.success("Order confirmed successfully");
        fetchList(); // Refresh the list after confirmation
      } else {
        toast.error("Failed to confirm order");
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error("Failed to confirm order");
    }
  }

  const handleReject = async (HID) => {
    try {
      const response = await axios.post(`${url}/order/reject/${HID}`);
      if (response.status === 200) {
        toast.success("Order rejected successfully");
        fetchList(); // Refresh the list after rejection
      } else {
        toast.error("Failed to reject order");
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error("Failed to reject order");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='app-content'>
      <Sidebar user={user}/>
    <div className="order-list-container">
      {list.length > 0 ? (
        list.map(order => (
          <div key={order.HID} className="order-container">
            <div className="order-header">
              <h3>Order ID: {order.HID}</h3>
              <p>Date & Time: {order.date_time}</p>
              <p>Address: {order.Address}</p>
              <p>Total: ${order.total}</p>
            </div>
            <div className="order-details">
              <h4>Order Items:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderList && order.orderList.length > 0 ? (
                    order.orderList.map(item => (
                      <tr key={item.PID}>
                        <td>{item.name}</td>
                        <td>{item.size}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
            <div className='button-container'>
              <button onClick={() => handleReject(order.HID)}>Reject</button>
              <button onClick={() => handleConfirm(order.HID)}>Confirm</button>
            </div>
            </div>
          </div>
        ))
      ) : (
        <p>No Pending Order</p>
      )}
    </div>
    </div>
  );
}

export default StaffConfirm;
