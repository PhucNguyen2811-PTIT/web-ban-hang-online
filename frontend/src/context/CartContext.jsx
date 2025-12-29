import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // LOAD CART KHI APP MỞ
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userID) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cart/${user.userID}`)
      .then((res) => setCartItems(res.data))
      .catch(console.error);
  }, []);

  // Thêm sản phẩm
  const addToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.userID) return;

    await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
      userID: user.userID,
      productID: product.id,
    });

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/cart/${user.userID}`
    );
    setCartItems(res.data);
  };

  // Xóa
  const removeFromCart = async (cartID) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/cart/${cartID}`);

    setCartItems((prev) => {
      const after = prev.filter((item) => item.cartID !== cartID);
      return after;
    });
  };

  // Update số lượng
  const updateQuantity = async (cartID, newQty) => {
    if (newQty < 1) return;

    await axios.put(`${import.meta.env.VITE_API_URL}/cart/update`, {
      cartID,
      quantity: newQty,
    });

    setCartItems((prev) =>
      prev.map((item) =>
        item.cartID === cartID ? { ...item, quantity: newQty } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
