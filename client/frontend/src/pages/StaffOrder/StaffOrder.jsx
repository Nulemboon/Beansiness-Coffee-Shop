import { useState, useEffect } from 'react';
import './StaffOrder.css';
import { url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar/Sidebar';
import OfflineDetail from '../../components/OfflineDetail/OfflineDetail';
import Cookies from 'js-cookie';

const StaffOrder = () => {
  const [products, setProducts] = useState([
    {
      product_id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      category: 'Salad',
    },
    {
      product_id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      category: 'Salad',
    },
    {
      product_id: '3',
      name: 'Product 3',
      description: 'Description 3',
      price: 300,
      category: 'Salad',
    },
  ]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showOfflineDetail, setShowOfflineDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/product`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        toast.error('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  const addProduct = (productId) => {
    const productToAdd = products.find((product) => product.product_id === productId);
    if (productToAdd) {
      const existingProduct = selectedProductIds.find((item) => item.product_id === productId);
      if (existingProduct) {
        const updatedProducts = selectedProductIds.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item
        );
        setSelectedProductIds(updatedProducts);
      } else {
        setSelectedProductIds([
          ...selectedProductIds,
          {
            product_id: productToAdd.product_id,
            name: productToAdd.name,
            price: productToAdd.price,
            quantity: 1,
            totalPrice: productToAdd.price,
          },
        ]);
      }
    }
  };

  const removeProduct = (product_id) => {
    const updatedProducts = selectedProductIds
      .map((product) => {
        if (product.product_id === product_id) {
          const updatedQuantity = product.quantity - 1;
          return updatedQuantity > 0 ? { ...product, quantity: updatedQuantity } : null;
        }
        return product;
      })
      .filter(Boolean);

    setSelectedProductIds(updatedProducts);
  };

  const emptyProduct = (product_id) => {
    const updatedProducts = selectedProductIds.filter((product) => product.product_id !== product_id);
    setSelectedProductIds(updatedProducts);
  };

  const handleProductDoubleClick = (product) => {
    setSelectedProduct(product);
    setShowOfflineDetail(true);
  };

  const handleCloseOfflineDetail = () => {
    setShowOfflineDetail(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async () => {
    console.log(selectedProductIds);
    Cookies.set('cart', JSON.stringify(selectedProductIds), { expires: 7 });
    try {
      const response = await axios.post(`${url}/order/offline`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  return (
    <div className='app-content'>
      <Sidebar />
      <div>
        <div className='product-list'>
          <h2>Product List</h2>
          <ul className='product-container'>
            {products.map((product) => (
              <li
                key={product.product_id}
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
                <tr key={product.product_id}>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>${product.totalPrice}</td>
                  <td>
                    <button onClick={() => addProduct(product.product_id)}>+</button>
                    <button onClick={() => removeProduct(product.product_id)}>-</button>
                    <button onClick={() => emptyProduct(product.product_id)}>x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='submit-container'>
            {selectedProductIds.length > 0 && (
              <button className='button-submit' onClick={handleSubmit}>
                Order
              </button>
            )}
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
