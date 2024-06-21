import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:3000"; // Ensure this is the correct base URL for your API
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");

  // Function to add item to the cart
  const addToCart = async (itemId, quantity = 1, size = 'M', toppings = []) => {
    console.log(`Attempting to add item with ID: ${itemId} to cart`);
  
    // Update local state
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (!updatedCart[itemId]) {
        updatedCart[itemId] = { quantity, size, toppings };
      } else {
        updatedCart[itemId].quantity += quantity;
      }
      console.log("Updated Cart Items after add:", updatedCart); // Log updated state immediately
      return updatedCart;
    });
  
    // Update cart on server if user is logged in
    if (token) {
      try {
        const response = await axios.post(
          `${url}/cart`,
          { product_id: itemId, quantity, size, toppings },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Add to cart response:", response.data);
  
        // Optionally, you can update the local state with the server response if necessary
        // Example: Assuming the server response contains the updated cart state
        // setCartItems(response.data.cart);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };
  

  // Function to remove item from the cart
  const removeFromCart = async (itemId, size = 'M', toppings = []) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId].quantity > 1) {
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
        console.log("Remove from cart response:", response);
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Function to calculate the total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item].quantity > 0) { // Use cartItems[item].quantity to check quantity
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item].quantity;
        }
      }
    }
    return totalAmount;
  };

  // Function to fetch the list of food items
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/product`);
      setFoodList(response.data.data); // Assume API returns an object with a data array
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Function to load cart data from the server
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
            toppings: item.toppings 
          };
          return acc;
        }, {});
        setCartItems(cartData);
      } catch (error) {
        console.error("Error loading cart data:", error);
      }
    }
  };

  // Load initial data and cart data when component mounts
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData();
      }
    }
    loadData();
  }, []);

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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
