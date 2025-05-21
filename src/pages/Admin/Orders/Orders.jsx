import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiDollarSign,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFilter,
  FiPrinter,
  FiUser,
} from "react-icons/fi";
import { BsBoxSeam } from "react-icons/bs";
import axios from "axios";
import ROISER from "../../../assets/ROISER.png";

import { FiTrash2 } from "react-icons/fi"; //Delete Icon
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [selectedShipping, setSelectedShipping] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Filter options
  const statuses = [
    "All",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const payments = ["All", "Paid", "Pending", "Refunded", "Failed"];
  const shippingMethods = ["All", "Standard", "Express", "Free"];

  const getAuthToken = () => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  // Fetch all orders from admin endpoint
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("No authentication token found");
        }
        const response = await axios.get(
          "http://localhost:3000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    // Order number match (case insensitive)
    const displayedOrderNumber = `ORD-${order._id.slice(-6).toUpperCase()}`;
    const orderNumberMatch = displayedOrderNumber.includes(
      searchTerm.toUpperCase()
    );

    // Customer info match (case insensitive)
    const customerMatch =
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.shippingInfo.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Status filter (case insensitive)
    const matchesStatus =
      selectedStatus === "All" ||
      order.status.toLowerCase() === selectedStatus.toLowerCase();

    // Payment filter - simplified logic
    const matchesPayment =
      selectedPayment === "All" ||
      (order.paymentInfo.status
        ? order.paymentInfo.status.toLowerCase() ===
          selectedPayment.toLowerCase()
        : selectedPayment === "Pending");

    // Shipping filter - use actual data without assumptions
    const matchesShipping =
      selectedShipping === "All" ||
      order.shippingInfo.shippingMethod?.toLowerCase() ===
        selectedShipping.toLowerCase();

    // Return true if either order number matches OR other filters match
    return (
      (orderNumberMatch || customerMatch) &&
      matchesStatus &&
      matchesPayment &&
      matchesShipping
    );
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      await axios.put(
        `http://localhost:3000/api/admin/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (viewOrder && viewOrder._id === orderId) {
        setViewOrder({ ...viewOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      setError("Failed to update order status. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "processing":
        return <FiClock className="text-yellow-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateItemsCount = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Add this function to your component
  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    const logoBase64 = ROISER;

    const invoiceContent = `
  <html>
    <head>
      <title>Invoice - ORD-${order._id.slice(-6).toUpperCase()}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
          --primary: #4f46e5;
          --primary-light: #6366f1;
          --dark: #1e293b;
          --light: #f8fafc;
          --gray: #64748b;
          --border: #e2e8f0;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          color: var(--dark);
          background: white;
          padding: 2rem;
        }
        
        .invoice {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.05);
          border-radius: 12px;
          overflow: hidden;
          padding: 2.5rem;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #885B3A;
          margin-bottom: 0.25rem;
        }
        
        .invoice-meta {
          color: var(--gray);
          font-size: 0.875rem;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .card {
          background: var(--light);
          border-radius: 8px;
          padding: 1.25rem;
        }
        
        .card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #885B3A;
        }
        
        .card p {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        th {
          text-align: left;
          padding: 0.75rem 1rem;
          background: var(--primary);
          color: white;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        td {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          font-size: 0.875rem;
        }
        
        tr:last-child td {
          border-bottom: none;
        }
        
        .text-right {
          text-align: right;
        }
        
        .text-bold {
          font-weight: 600;
        }
        
        .totals {
          float: right;
          width: 300px;
          margin-top: 1rem;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
        }
        
        .total-row:last-child {
          border-bottom: none;
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 0.5rem;
        }
        
        .footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          color: var(--gray);
          font-size: 0.875rem;
        }
        
        .thank-you {
          font-size: 1.125rem;
          font-weight: 500;
          color: #885B3A;
          margin-bottom: 0.5rem;
        }
        
        .contact {
          margin-top: 0.5rem;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-img {
          height: 40px;
          width: auto;
        }
        
        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark);
        }
        
        .no-print {
          display: none;
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          
          .invoice {
            box-shadow: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="brand-container">
            <img src="${logoBase64}" alt="ROISER Logo" class="logo-img" />
            <p class="brand-name">ROISER</p>
          </div>

          <div class="invoice-title">
            <h1>INVOICE</h1>
            <div class="invoice-meta">
              <p>#ORD-${order._id.slice(-6).toUpperCase()}</p>
              <p>${formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>
        
        <div class="grid">
          <div class="card">
            <h3>Bill To</h3>
            <p class="text-bold">${order.shippingInfo.firstName} ${
      order.shippingInfo.lastName
    }</p>
            <p>${order.shippingInfo.email}</p>
            <p>${order.shippingInfo.phone}</p>
            <p>${order.shippingInfo.address}</p>
            <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${
      order.shippingInfo.zipCode
    }</p>
          </div>
          
          <div class="card">
            <h3>From</h3>
            <p class="text-bold">ROISER FURNITURE STORE</p>
            <p>123 Street</p>
            <p>Newyork, UnitedStates</p>
            <p>support@roiser.com</p>
            <p>(123) 456-7890</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>
                  <div class="text-bold">${
                    item.product?.name || "Product"
                  }</div>
                  <div style="font-size: 0.75rem; color: var(--gray); margin-top: 0.25rem;">
                    SKU: ${item.product?._id.slice(-6).toUpperCase() || "N/A"}
                  </div>
                </td>
                <td class="text-right">$${item.price.toFixed(2)}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${(item.price * item.quantity).toFixed(
                  2
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${order.paymentInfo.subtotal.toFixed(2)}</span>
          </div>
          ${
            order.paymentInfo.discount > 0
              ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>-$${order.paymentInfo.discount.toFixed(2)}</span>
            </div>
          `
              : ""
          }
          <div class="total-row">
            <span>Shipping:</span>
            <span>$${order.paymentInfo.shipping.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${order.paymentInfo.tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Total:</span>
            <span>$${order.paymentInfo.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">Thank you for order!</div>
          <p>Please make payment within 15 days of receiving this invoice</p>
          <div class="contact">
            Questions? Email support@roiser.com or call (123) 456-7890
          </div>
        </div>
        
        <button class="no-print" onclick="window.print()" style="position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          Print Invoice
        </button>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 300);
          };
        </script>
      </div>
    </body>
  </html>
  `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  //Handle Delete Order & Confirmation
  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    try {
      const token = getAuthToken();
      await axios.delete(
        `http://localhost:3000/api/admin/orders/${orderToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(orders.filter((order) => order._id !== orderToDelete));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Failed to delete order:", err);
      toast.error(err.response?.data?.error || "Failed to delete order");
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  return (
    <div className="p-8 transition-all duration-300 lg:mt-0 mt-6">
      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold">
          Confirm Order Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-gray-700"
          >
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            className="hover:bg-red-50"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>

      {/* Orders Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-blue-100 text-blue-600">
            <BsBoxSeam className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold my-1">{orders.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-yellow-100 text-yellow-600">
            <FiClock className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Processing</p>
            <p className="text-2xl font-bold my-1">
              {orders.filter((order) => order.status === "processing").length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-blue-100 text-blue-600">
            <FiTruck className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-2xl font-bold my-1">
              {orders.filter((order) => order.status === "shipped").length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-green-100 text-green-600">
            <FiCheckCircle className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-2xl font-bold my-1">
              {orders.filter((order) => order.status === "delivered").length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders, customers or emails..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
            >
              {payments.map((payment) => (
                <option key={payment} value={payment}>
                  {payment}
                </option>
              ))}
            </select>
          </div>

          {/* Shipping Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTruck className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
            >
              {shippingMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ORD-{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.shippingInfo.firstName}{" "}
                      {order.shippingInfo.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user ? (
                        <div className="flex items-center">
                          <FiUser className="mr-1" />
                          {order.user.email}
                        </div>
                      ) : (
                        "Guest"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {calculateItemsCount(order.items)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.paymentInfo.total.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click events from interfering
                            handlePrintInvoice(order); // Pass the current row's order data
                          }}
                          title="Print Invoice" // Add tooltip
                        >
                          <FiPrinter />
                        </button>
                        {/* Delete Btn */}
                        <button
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(order._id);
                          }}
                          title="Delete Order"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  Order ORD-{viewOrder._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-gray-500">
                  Placed on {formatDate(viewOrder.createdAt)}
                </p>
                {viewOrder.user && (
                  <p className="text-gray-500 flex items-center">
                    <FiUser className="mr-1" /> {viewOrder.user.email}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Customer Information
                </h3>
                <p className="text-gray-600">
                  {viewOrder.shippingInfo.firstName}{" "}
                  {viewOrder.shippingInfo.lastName}
                </p>
                <p className="text-gray-600">{viewOrder.shippingInfo.email}</p>
                <p className="text-gray-600">{viewOrder.shippingInfo.phone}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Shipping Address
                </h3>
                <p className="text-gray-600">
                  {viewOrder.shippingInfo.address}
                </p>
                <p className="text-gray-600">
                  {viewOrder.shippingInfo.city}, {viewOrder.shippingInfo.state}{" "}
                  {viewOrder.shippingInfo.zipCode}
                </p>
                {viewOrder.shippingInfo.shippingMethod && (
                  <p className="text-gray-600 mt-2">
                    <strong>Method:</strong>{" "}
                    {viewOrder.shippingInfo.shippingMethod}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Order Summary
                </h3>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">
                    ${viewOrder.paymentInfo.subtotal.toFixed(2)}
                  </span>
                </div>
                {viewOrder.paymentInfo.discount > 0 && (
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-red-600">
                      -${viewOrder.paymentInfo.discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800">
                    ${viewOrder.paymentInfo.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-800">
                    ${viewOrder.paymentInfo.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 mt-2">
                  <span className="font-medium text-gray-800">Total:</span>
                  <span className="font-medium text-gray-800">
                    ${viewOrder.paymentInfo.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Order Items</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {item.product?.name || "Product not available"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">
                  Update Status
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      updateOrderStatus(viewOrder._id, "processing")
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewOrder.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(viewOrder._id, "shipped")}
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewOrder.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(viewOrder._id, "delivered")
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewOrder.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(viewOrder._id, "cancelled")
                    }
                    className={`px-3 py-1 rounded-md text-sm ${
                      viewOrder.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button
                onClick={() => handlePrintInvoice(viewOrder)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
