import React, { useContext, useEffect, useState } from 'react';
import './StaffConfirm.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';

const StaffConfirm = ({ user }) => {
  const { url } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/order/pending`);
      console.log(response.data);
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

  const handleConfirm = async (_id) => {
    try {
      const response = await axios.post(`${url}/order/approve/${_id}`);
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

  const handleReject = async (_id) => {
    try {
      const response = await axios.post(`${url}/order/reject/${_id}`);
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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/product`);
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        toast.error('Error fetching products');
      }
    };
    fetchProducts();
    fetchList();
  }, [url]);

  return (
    <div className='app-content'>
      <Sidebar user={user}/>
      <div className="order-list-container">
        {list.length > 0 ? (
          list.map(order => (
            <div key={order._id} className="order-container">
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <p>Date & Time: {new Date(order.completed_at).toLocaleString()}</p>
                <p>Address: {order.delivery_info.address}</p>
              </div>
              <div className="order-details">
                <h4>Order Items:</h4>
                <table className='selected-products-table'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Size</th>
                      <th>Toppings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item, index) => {
                      const product = products.find(p => p._id === item.product_id);
                      return (
                        <tr key={item._id}>
                          <td>{product ? product.name : 'Unknown Product'}</td>
                          <td>{item.quantity}</td>
                          <td>{item.size}</td>
                          <td>
                            {item.toppings.map((toppingId, idx) => {
                              const topping = product?.available_toppings.find(t => t._id === toppingId);
                              return topping ? (
                                <span key={toppingId}>{topping.name}{idx < item.toppings.length - 1 ? ', ' : ''}</span>
                              ) : null;
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className='button-container'>
                  <button onClick={() => handleReject(order._id)}>Reject</button>
                  <button onClick={() => handleConfirm(order._id)}>Confirm</button>
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
