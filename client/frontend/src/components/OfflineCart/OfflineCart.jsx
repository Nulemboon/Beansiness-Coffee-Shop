import React, { useMemo, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';

const CartTable = ({ products, cart }) => {
  const [selectedProductIds, setSelectedProductIds] = useState(cart.map(item => ({ ...item, id: uuidv4() })) || []);
  const { url } = useContext(StoreContext);

  useEffect(() => {
    setSelectedProductIds(cart.map(item => ({ ...item, id: uuidv4() })) || []);
  }, [cart]);

  // Memoized groupedProducts
  const groupedProducts = useMemo(() => {
    const productMap = new Map();

    selectedProductIds.forEach((product) => {
      const key = product._id;
      if (!productMap.has(key)) {
        productMap.set(key, []);
      }
      productMap.get(key).push(product);
    });

    return Array.from(productMap.entries());
  }, [selectedProductIds]);

  // Calculate total price including toppings
  const calculateTotalPrice = (productId, toppings, quantity) => {
    const basePrice = products.find(p => p._id === productId)?.price || 0;
    const toppingsPrice = toppings.reduce((total, topping) => total + topping.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  // Handle remove product function
  const handleRemoveProduct = async (product) => {
    try {
      const response = await axios.post(`${url}/cart/decrease`, {
          productId: product._id,
          size: product.size,
          toppings: product.toppings,
      });

      if (response.status === 200) {
        toast.success('Product removed');
      } else {
        toast.error(response.data.message); // Show error message if removal fails
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove product');
    }
  };

  // Handle add product function
  const handleAddProduct = async (product) => {
    try {
      const response = await axios.post(`${url}/cart`, {
        productId: product._id,
        quantity: 1,
        size: product.size,
        toppings: product.toppings,
      });

      if (response.status === 200) {
        toast.success('Product added');
      } else {
        toast.error(response.data.message); // Show error message if adding fails
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  return (
    <table className='selected-products-table'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Quantity</th>
      <th>Size</th>
      <th>Toppings</th>
      <th>Total Price</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {groupedProducts.map(([productId, groupedProducts]) => (
      groupedProducts.map((product, index) => (
        <tr key={`${product._id}-${product.toppings.map(t => t.name).join(',')}-${product.id}`}>
          {index === 0 && (
            <td rowSpan={groupedProducts.length}>{product.name}</td>
          )}
          <td>{product.quantity}</td>
          <td>{product.size}</td>
          <td>
            {product.toppings.map((topping, idx) => (
              <React.Fragment key={`${topping.name}-${idx}`}>
                <span>{topping.name}</span>
                {idx < product.toppings.length - 1 && <br />}
              </React.Fragment>
            ))}
          </td>
          <td>{calculateTotalPrice(productId, product.toppings, product.quantity)}đ</td>
          <td>
            <button onClick={() => handleAddProduct(product)}>+</button>
            <button onClick={() => handleRemoveProduct(product)}>-</button>
          </td>
        </tr>
      ))
    ))}
  </tbody>
</table>

  );
};

export default CartTable;
