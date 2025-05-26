"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem("cart") : null;
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  function addToCart(product, withFee = false) {
    const item = withFee ? { ...product, price: product.price + 5, fee: 5 } : { ...product };
    setCart(prev => [...prev, item]);
  }
  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }
  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
} 