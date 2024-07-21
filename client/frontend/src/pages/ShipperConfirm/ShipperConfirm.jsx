import React, { useState, useEffect, useContext } from 'react';
import './ShipperConfirm.css';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ShipperConfirm = () => {
  const [list, setList] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const { url } = useContext(StoreContext);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/order/approved`);
      if (response.data && Array.isArray(response.data)) {
        setList(response.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to fetch orders");
    }
  };

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

  const handleAction = async (orderId, action) => {
    if (action === 'reject') {
      toast.error('You are not allowed to reject this order!');
      return;
    }

    try {
      const response = await axios.post(`${url}/order/ship/${orderId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Order confirmed successfully");
        fetchList(); // Refresh the list after confirmation
      } else {
        toast.error("Failed to confirm order");
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchList();
  }, []);

  const getProductById = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product : null;
  };

  const calculateTotal = (order) => {
    return order.order_items.reduce((sum, item) => {
      const product = getProductById(item.product_id);
      if (product) {
        const toppingPrice = item.toppings.reduce((toppingSum, topping) => {
          const toppingDetail = product.available_toppings.find(t => t._id === topping);
          return toppingDetail ? toppingSum + toppingDetail.price : toppingSum;
        }, 0);
        return sum + (product.price + toppingPrice) * item.quantity;
      }
      return sum;
    }, order.shipping_fee);
  };

  const getToppingNames = (product, toppingIds) => {
    if (!product) return [];
    return toppingIds.map(toppingId => {
      const topping = product.available_toppings.find(t => t._id === toppingId);
      return topping ? topping.name : 'Unknown Topping';
    });
  };

  return (
    <div className='app-content'>
      <div className="order-list-container">
        {list.length > 0 ? (
          list.map((order) => (
            <div key={order._id} className="order-container">
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <p>Account: {order.account_id.name}</p>
                <p>Phone: {order.account_id.phone}</p>
                <p>Email: {order.account_id.email}</p>
                <p>Shipping Address: {order.delivery_info.address}</p>
                <p>Shipping Fee: {order.shipping_fee}đ</p>
                <p>Total: {calculateTotal(order)}đ</p>
                <p>Completed At: {new Date(order.completed_at).toLocaleString()}</p>
              </div>
              <div className="order-details">
                <h4>Order Items:</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Size</th>
                      <th>Toppings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item) => {
                      const product = getProductById(item.product_id);
                      return (
                        <tr key={item._id}>
                          <td>{product ? product.name : 'Unknown Product'}</td>
                          <td>{item.quantity}</td>
                          <td>{item.size}</td>
                          <td>{getToppingNames(product, item.toppings).join(', ') || 'None'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="button-container">
                  {completedOrders.includes(order._id) ? (
                    <button disabled>Completed</button>
                  ) : (
                    <>
                      <button onClick={() => handleAction(order._id, 'reject')}>Reject</button>
                      <button onClick={() => handleAction(order._id, 'confirm')}>Confirm</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Approved Order</p>
        )}
      </div>
    </div>
  );
};

export default ShipperConfirm;