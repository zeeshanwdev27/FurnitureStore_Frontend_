import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import successIcon from "../../assets/success.svg";
import deliveryIcon from "../../assets/delivery.svg";
import emailIcon from "../../assets/email.svg";
import { toast } from "react-toastify";

function OrderConfirm() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
  
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }
  
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: abortController.signal,
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch order details");
        }
  
        const data = await response.json();
  
        if (!data.success || !data.order) {
          throw new Error("Invalid order data received");
        }
  
        if (isMounted) {
          setOrder(data.order);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          console.error("Order fetch error:", err);
          setError(err.message);
          toast.error(err.message || "Failed to load order details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    clearCart();
    fetchOrder();
  
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [orderId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#885B3A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white px-6 sm:px-10 lg:px-20 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#885B3A] text-white px-6 py-2 rounded-md hover:bg-[#774A2A] transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-sm overflow-hidden">
        {/* Success Header */}
        <div className="bg-[#885B3A] text-white px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={successIcon} alt="Success" className="h-16 w-16" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Thank you for your order!
          </h1>
          <p className="text-white/90">
            Order #{order?._id.slice(-8).toUpperCase()} • {order ? formatDate(order.createdAt) : "N/A"}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Order Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Delivery Info */}
            <div className="bg-white p-6 rounded-lg shadow-xs">
              <div className="flex items-center mb-4">
                <img src={deliveryIcon} alt="Delivery" className="h-5 w-5 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  Delivery Information
                </h3>
              </div>
              {order?.shippingInfo && (
                <div className="text-gray-700 space-y-2">
                  <p className="font-medium">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}</p>
                  <p>{order.shippingInfo.phone}</p>
                  <p>{order.shippingInfo.email}</p>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="bg-white p-6 rounded-lg shadow-xs">
              <div className="flex items-center mb-4">
                <img src={emailIcon} alt="Email" className="h-5 w-5 mr-2" />
                <h3 className="font-semibold text-gray-900">Order Details</h3>
              </div>
              <div className="text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-medium">#{order?._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{order ? formatDate(order.createdAt) : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{order?.status || "Processing"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">Cash On Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ordered Items
            </h3>
            <div className="bg-white rounded-lg shadow-xs overflow-hidden">
              {order?.items.map((item) => (
                <div key={item._id} className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <div className="flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.image?.url || "https://via.placeholder.com/150"}
                        alt={item.product?.name || item.name}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {item.product?.name || item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        <p className="text-base font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-white p-6 rounded-lg shadow-xs mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${order?.paymentInfo.subtotal.toFixed(2)}
                </span>
              </div>
              {order?.paymentInfo.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-red-500">
                    -${order.paymentInfo.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ${order?.paymentInfo.shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ${order?.paymentInfo.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  ${order?.paymentInfo.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContinueShopping}
              className="cursor-pointer flex-1 max-w-xs mx-auto bg-[#885B3A] hover:bg-[#774A2A] text-white px-6 py-3 rounded-md transition shadow-sm hover:shadow-md"
            >
              Continue Shopping
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Need help?{" "}
              <a href="/contact" className="text-[#885B3A] hover:underline font-medium">
                Contact our customer support
              </a>
            </p>
            <p className="mt-1">
              We'll email you when your order ships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;