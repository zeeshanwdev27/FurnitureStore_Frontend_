import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartSidebar() {
  const {
    cartItems,
    removeFromCart,
    isCartOpen,
    toggleCart,
    subtotal = 0,
    shipping = 5,
    total = subtotal + shipping,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const navigate = useNavigate();

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const cartElement = document.querySelector(".cart-sidebar");
      if (isCartOpen && cartElement && !cartElement.contains(event.target)) {
        toggleCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, toggleCart]);

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    toggleCart();

    if (user) {
      navigate("/checkout");
    } else {
      navigate("/signin", {
        state: { from: { pathname: "/checkout" } },
      });
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut" }}
            className="cart-sidebar fixed top-0 right-0 w-full max-w-sm bg-white shadow-lg z-50 flex flex-col h-screen"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Your Cart ({cartItems.length})</h2>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                &times;
              </button>
            </div>

            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg">Your cart is empty</p>
                  <button
                    onClick={toggleCart}
                    className="cursor-pointer mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <motion.li
                      key={item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="py-4 flex items-center"
                    >
                      <img
                        src={item.image?.url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <div className="flex items-center mt-1">
                          <button
                            onClick={() => decrementQuantity(item._id)}
                            className="text-gray-500 hover:text-black cursor-pointer w-6 h-6 flex items-center justify-center border rounded"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="mx-2 text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item._id)}
                            className="text-gray-500 hover:text-black cursor-pointer w-6 h-6 flex items-center justify-center border rounded"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-medium mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="ml-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Fixed Summary at Bottom */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-white">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="cursor-pointer w-full py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={toggleCart}
                  className="cursor-pointer w-full mt-2 py-2 border border-black text-black font-medium rounded hover:bg-gray-100 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}