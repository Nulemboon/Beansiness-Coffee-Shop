import React, { useMemo, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';
import { useCookies } from 'react-cookie';

const CartTable = ({ products }) => {
  const { url } = useContext(StoreContext);
  const [cookies, setCookie] = useCookies(['cart']);
  const [selected_ids, setSelected_ids] = useState([]);

  const cart = cookies.cart || [];
  useEffect(() => {
    setSelected_ids(Array.isArray(cart) ? cart.map(item => ({ ...item, id: uuidv4() })) : []);
  }, [cookies.cart]);

  // Memoized groupedProducts
  const groupedProducts = useMemo(() => {
    const productMap = new Map();

    selected_ids.forEach((product) => {
      const key = product._id;
      if (!productMap.has(key)) {
        productMap.set(key, []);
      }
      productMap.get(key).push(product);
    });

    return Array.from(productMap.entries());
  }, [selected_ids]);

  // Calculate total price including toppings
  const calculateTotalPrice = (product) => {
    const item = products?.find(p => p._id === product._id);
  
    if (!item) return 0;
  
    const index = cart.findIndex(
      (itemNew) =>
        itemNew._id === product._id &&
        itemNew.size === product.size &&
        itemNew.toppings.sort().toString() === product.toppings.sort().toString()
    );
  
    if (index === -1) return 0; // Check if the product is not found in the cart
  
    const topId = cart[index]?.toppings || [];
    const totalToppingPrice = item.available_toppings
      ?.filter(at => topId.includes(at._id))
      ?.reduce((sum, topping) => sum + topping.price, 0) || 0;
  
    const basePrice = item.price || 0;
    const totalPrice = (basePrice + totalToppingPrice) * product.quantity;
  
    return product.size === 'M' ? totalPrice : totalPrice + 5000;
  };
  

  // Handle remove product function
  const handleRemoveProduct = async (product) => {
    try {
      const item = {
        _id: product._id,
        quantity: 1,
        size: product.size,
        toppings: product.toppings,
      };
  
      const existingItemIndex = cart.findIndex(
        (itemNew) =>
          itemNew._id === item._id &&
          itemNew.size === item.size &&
          itemNew.toppings.sort().toString() === item.toppings.sort().toString()
      );
  
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity -= 1;
        if (cart[existingItemIndex].quantity === 0) {
          cart.splice(existingItemIndex, 1);
        }
        setCookie('cart', cart, { path: '/' });
        toast.success('Product removed');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove product');
    }
  };
  

  // Handle add product function
  const handleAddProduct = async (product) => {
    try {
      const item = {
        _id: product._id,
        quantity: 1,
        size: product.size,
        toppings: product.toppings,
      };

      const existingItemIndex = cart.findIndex(
        (itemNew) =>
          itemNew._id === item._id &&
          itemNew.size === item.size &&
          itemNew.toppings.sort().toString() === item.toppings.sort().toString()
      );

      cart[existingItemIndex].quantity += 1;
      setCookie('cart', cart, { path: '/' });
      toast.success('Product added');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const calculateCartTotal = () => {
    return selected_ids.reduce((total, product) => {
      return total + calculateTotalPrice(product);
    }, 0);
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
        {groupedProducts.map(([_id, groupedProducts]) => (
          groupedProducts.map((product, index) => (
            <tr key={`${product._id}-${product.toppings.join(',')}-${product.id}`}>
              {index === 0 && (
                <td rowSpan={groupedProducts.length}>
                  {products?.find(p => p._id === _id)?.name || 'Unknown Product'}
                </td>
              )}
              <td>{product.quantity}</td>
              <td>{product.size}</td>
              <td>
                {product.toppings.map((toppingId, idx) => {
                  const index = cart.findIndex(
                    (itemNew) =>
                      itemNew._id === product._id &&
                      itemNew.size === product.size &&
                      itemNew.toppings.sort().toString() === product.toppings.sort().toString()
                  );
                  if (index === -1) return 0;
                  const topId = cart[index].toppings;
                  const matchingToppings = products
                    ?.find(p => p._id === product._id)
                    ?.available_toppings
                    .filter(at => topId.includes(at._id)) || [];

                  const topping = matchingToppings.find(at => at._id === toppingId);

                  return topping ? (
                    <React.Fragment key={toppingId}>
                      <span>{topping.name}</span>
                      {idx < product.toppings.length - 1 && <br />}
                    </React.Fragment>
                  ) : null;
                })}
              </td>
              <td>{calculateTotalPrice(product)}đ</td>
              <td>
                <button onClick={() => handleAddProduct(product)}>+</button>
                <button onClick={() => handleRemoveProduct(product)}>-</button>
              </td>
            </tr>
          ))
        ))}
        <tr>
          <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total: <span style={{ fontWeight: 'normal' }}>{calculateCartTotal()}đ</span></td>
        </tr>
      </tbody>
    </table>
  );
};

export default CartTable;
