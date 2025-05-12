import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === product._id);
      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const incrementQuantity = useCallback((id) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id 
          ? { ...item, quantity: (item.quantity || 1) + 1 } 
          : item
      )
    );
  }, []);

  const decrementQuantity = useCallback((id) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const subtotal = useMemo(() => 
    cartItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    ),
    [cartItems]
  );

  const shipping = 10;
  const total = useMemo(() => subtotal + shipping, [subtotal]);

  const itemCount = useMemo(() => 
    cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    ),
    [cartItems]
  );

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    subtotal,
    shipping,
    total,
    itemCount
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    subtotal,
    total,
    itemCount
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}