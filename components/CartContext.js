"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext();
export const OrdersContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("orders");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem("cart") : null;
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [cart, orders]);

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
  function addOrder(order) {
    setOrders(prev => [...prev, order]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      <OrdersContext.Provider value={{ orders, addOrder }}>
        {children}
      </OrdersContext.Provider>
    </CartContext.Provider>
  );
}