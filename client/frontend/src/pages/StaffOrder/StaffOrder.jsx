import React, { useState, useEffect, useContext } from 'react';
import './StaffOrder.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import CartTable from '../../components/OfflineCart/OfflineCart';
import Sidebar from '../../components/Sidebar/Sidebar';
import OfflineDetail from '../../components/OfflineDetail/OfflineDetail';
// import { useCookies } from 'react-cookie';

const StaffOrder = ({ user }) => {
  // const [cookies, setCookie] = useCookies(['cart']);
  const { url } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  // const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [phone, setPhone] = useState('');
  const [showOfflineDetail, setShowOfflineDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [noPhone, setNoPhone] = useState(false);
  const defaultPhone = '0395842367';

  // Fetch products based on search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/product/${searchQuery}`);
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

    const fetchCart = async () => {
      try {
        const response = await axios.get(`${url}/cart`);
        if (response.data && Array.isArray(response.data)) {
          setCart(response.data);
        } else {
          toast.error('Failed to fetch cart');
        }
      } catch (error) {
        toast.error('Error fetching cart');
      }
    };

    if (searchQuery.trim() !== '') {
      fetchProducts();
    } else {
      // Fetch all products if search query is empty
      fetchProducts('/product');
    }
    fetchCart();
    console.log(cart);

    // setSelectedProductIds(cookies.cart);
  }, [searchQuery]);

  const handleProductDoubleClick = (product) => {
    setShowOfflineDetail(true);
    setSelectedProduct(product);
    };
    
  const handleCloseOfflineDetail = () => {
    setShowOfflineDetail(false);
    setSelectedProduct(null);
    // setSelectedProductIds(cookies.cart);
  };

  // Submit offline order
  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number. Please enter a valid 10-digit phone number.');
      return;
    }
    // const cart = cookies.cart || [];
    if (cart.length < 1) {
      toast.error('Please select at least 1 product to place order.');
      return;
    }
    // setCookie('cart', JSON.stringify(cart), { path: '/' });

    // console.log(cookies.cart);
    try {
      const response = await axios.post(`${url}/order/offline`, {
        phone: phone,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
        // setCookie('cart', [], { path: '/' }); // Clear cart
        // setSelectedProductIds([]);
        setPhone('');
        setNoPhone(false);
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

  const handleNoPhoneChange = (e) => {
    setNoPhone(e.target.checked);
    setPhone(defaultPhone);
    if (noPhone) {
      setPhone('');
    }
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
                  <div><h3>{product.name}</h3></div>
                  <div><p>{product.price}đ</p></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='selected-products'>
          <h2>Selected Products</h2>
          <CartTable 
            products={products}
            cart={cart}
          />
          <div className='submit-container'>
            <input 
              type='text' 
              className='phone-input' 
              placeholder='Phone Number' 
              value={phone}
              onChange={handlePhoneChange}
              disabled={noPhone}
            />
            <label style={{ marginLeft: '10px', marginTop: '20px' }}>
              <input 
                type='checkbox' 
                checked={noPhone}
                onChange={handleNoPhoneChange}
              />
              No phone
            </label>
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
