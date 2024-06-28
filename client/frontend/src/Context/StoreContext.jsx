import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:3000";
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  // Function to set the token in Axios defaults
  const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
  };

  const addToCart = async (itemId, quantity, size, toppings) => {
    console.log(`Attempting to add item with ID: ${itemId} to cart`);

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (!updatedCart[itemId]) {
        updatedCart[itemId] = { quantity, size, toppings };
      } else {
        updatedCart[itemId].quantity += quantity;
        updatedCart[itemId].size = size;
        updatedCart[itemId].toppings = toppings;
      }
      console.log("Updated Cart Items after add:", updatedCart);
      return updatedCart;
    });

    if (token) {
      try {
        const response = await axios.post(
          `${url}/cart`,
          { product_id: itemId, quantity, size, toppings },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Add to cart response:", response.data);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId, size = "M", toppings = []) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId]?.quantity > 1) {
        updatedCart[itemId].quantity -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    if (token) {
      try {
        const response = await axios.delete(`${url}/cart`, {
          data: { product_id: itemId, size, toppings },
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Remove from cart response:", response.data);
        setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    if (!food_list || food_list.length === 0) {
      console.warn("Food list is empty or not loaded yet.");
      return totalAmount;
    }

    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      if (item?.quantity > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * item.quantity;
        } else {
          console.warn(`Product with ID ${itemId} not found in food list.`);
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/product`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data from server
  const loadCartData = async () => {
    if (token) {
      try {
        const response = await axios.get(`${url}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = response.data.reduce((acc, item) => {
          acc[item.product_id] = {
            quantity: item.quantity,
            size: item.size,
            toppings: item.toppings,
          };
          return acc;
        }, {});
        setCartItems(cartData);
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    }
  };

  // Load initial data on component mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      console.log("Stored token retrieved on load:", storedToken);
      if (storedToken) {
        setToken(storedToken);
        await loadCartData();
      }
    }
    loadData();
  }, []);

  // Store token in local storage when it updates
  useEffect(() => {
    console.log("Token updated in context:", token);
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);
    }
  }, [token]);

  const contextValue = {
    url,
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    setAuthToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
