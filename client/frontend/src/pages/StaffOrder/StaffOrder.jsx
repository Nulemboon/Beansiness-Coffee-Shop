import React, { useState, useEffect } from 'react';
import './StaffOrder.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';
import OfflineDetail from '../../components/OfflineDetail/OfflineDetail';
import Cookies from 'js-cookies';

const StaffOrder = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([{
    _id: '1',
    name: 'Product 123',
    description: 'Description 1',
    price: 100,
    category: 'Salad',
    // image: assets.product1
  }, {
    _id: '2',
    name: 'Product 121',
    description: 'Description 2',
    price: 200,
    category: 'Salad',
    // image: assets.product2
  }, {
    _id: '3',
    name: 'Product 3',
    description: 'Description 3',
    price: 300,
    category: 'Salad',
    // image: assets.product3
  }]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [phone, setPhone] = useState('');
  const [showOfflineDetail, setShowOfflineDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/product/${searchQuery}`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        toast.error('Error fetching products');
      }
    };

    if (searchQuery.trim() !== '') {
      fetchProducts();
    } else {
      // Fetch all products if search query is empty
      fetchProducts('/product');
    }
  }, [searchQuery]);

  const addProduct = (productId) => {
    const productToAdd = products.find((product) => product._id === productId);
    if (productToAdd) {
      const existingProduct = selectedProductIds.find((item) => item._id === productId);
      if (existingProduct) {
        const updatedProducts = selectedProductIds.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
        setSelectedProductIds(updatedProducts);
      } else {
        setSelectedProductIds([
          ...selectedProductIds,
          {
            _id: productToAdd._id,
            name: productToAdd.name,
            price: productToAdd.price,
            quantity: 1,
            totalPrice: productToAdd.price
          }
        ]);
      }
    }
  };

  const removeProduct = (_id) => {
    const updatedProducts = selectedProductIds.map(product => {
      if (product._id === _id) {
        const updatedQuantity = product.quantity - 1;
        // Remove the product if quantity becomes 0
        return updatedQuantity > 0 ? { ...product, quantity: updatedQuantity } : null;
      }
      return product;
    }).filter(Boolean); // Filter out null values (products with quantity 0)

    setSelectedProductIds(updatedProducts);
  };

  const emptyProduct = (_id) => {
    const updatedProducts = selectedProductIds.filter(product => product._id !== _id);
    setSelectedProductIds(updatedProducts);
  };

  const handleProductDoubleClick = (product) => {
    setShowOfflineDetail(true);
    setSelectedProduct(product);
  };

  const handleCloseOfflineDetail = () => {
    setShowOfflineDetail(false);
    setSelectedProduct(null);
  };

  // Submit offline order
  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number. Please enter a valid 10-digit phone number.');
      return;
    }
    Cookies.set('cart', JSON.stringify(selectedProductIds), { expires: 7 });

    try {
      const response = await axios.post('/order/offline', {
        products: selectedProductIds,
        phone: phone,
      }, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        Cookies.removeItem('cart'); // Clear cart
        setSelectedProductIds([]);
      } else {
        toast.error(response.data.message); // Show error message if adding fails
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  return (
    <div className='app-content'>
      <Sidebar user={user} />
      <div>
        <div className='product-list'>
          <h2>Product List</h2>
          <form onSubmit={handleSearchSubmit} className='search-form'>
            <input
              type='text'
              placeholder='Search Products...'
              value={searchQuery}
              onChange={handleSearchChange}
              className='search-input'
            />
            <button type='submit' className='search-button'>Search</button>
          </form>
          <ul className='product-container'>
            {products.map((product) => (
              <li
                key={product._id}
                className='product-item'
                onDoubleClick={() => handleProductDoubleClick(product)}
              >
                <div className='product-details'>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='selected-products'>
          <h2>Selected Products</h2>
          <table className='selected-products-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedProductIds.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>${product.totalPrice}</td>
                  <td>
                    <button onClick={() => addProduct(product._id)}>+</button>
                    <button onClick={() => removeProduct(product._id)}>-</button>
                    <button onClick={() => emptyProduct(product._id)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='submit-container'>
            <input 
              type='text' 
              className='phone-input' 
              placeholder='Phone Number' 
              value={phone}
              onChange={handlePhoneChange}
            />
            <button className='button-submit' onClick={handleSubmit}>Order</button>
          </div>
        </div>
      </div>
      {showOfflineDetail && selectedProduct && (
        <OfflineDetail product={selectedProduct} onClose={handleCloseOfflineDetail} />
      )}
    </div>
  );
};

export default StaffOrder;
