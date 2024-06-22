import React, { useState, useEffect } from 'react';
import './ShipperConfirm.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';

const ShipperConfirm = () => {
  const [list, setList] = useState([
      {
       "HID": 1,
       "date_time": "2024-06-17 10:30 AM",
       "Address": "123 Main St, City A",
       "total": "200",
       "orderList": [
        {
         "PID": 101,
         "name": "Product A",
         "size": "Medium",
         "amount": 2
        },
        {
         "PID": 102,
         "name": "Product B",
         "size": "Large",
         "amount": 1
        }
       ]
      },
      {
       "HID": 2,
       "date_time": "2024-06-16 02:00 PM",
       "Address": "456 Elm St, City B",
       "total": "500",
       "orderList": [
        {
         "PID": 201,
         "name": "Product X",
         "size": "Small",
         "amount": 3
        },
        {
         "PID": 202,
         "name": "Product Y",
         "size": "Medium",
         "amount": 1
        },
        {
         "PID": 203,
         "name": "Product Z",
         "size": "Large",
         "amount": 2
        }
       ]
      }
     ]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/order`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders");
    }
  };

  const handleAction = async (HID, action) => {
    try {
      const response = await axios.post(`${url}/order/${action}`, { HID });
      if (response.data.success) {
        toast.success(`${action === 'confirm' ? 'Confirmed' : 'Rejected'} order successfully`);
        setCompletedOrders([...completedOrders, HID]);
        setList(list.filter((order) => order.HID !== HID)); // Remove completed order from list
      } else {
        toast.error(`Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='app-content'>
    <div className="order-list-container">
      {list.length > 0 ? (
        list.map((order) => (
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
                    order.orderList.map((item) => (
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

              <div className="button-container">
                {completedOrders.includes(order.HID) ? (
                  <button disabled>Completed</button>
                ) : (
                  <>
                    <button onClick={() => handleAction(order.HID, 'reject')}>
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(order.HID, 'confirm')}
                    >
                      Confirm
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
};

export default ShipperConfirm;
