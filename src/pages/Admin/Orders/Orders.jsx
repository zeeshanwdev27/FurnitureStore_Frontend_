import React, { useState } from 'react';
import { 
  FiSearch, 
  FiDollarSign, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle,
  FiFilter,
  FiPrinter
} from 'react-icons/fi';
import { BsBoxSeam } from 'react-icons/bs';

function Orders() {
  // Sample order data - replace with real data from your backend
  const [orders, setOrders] = useState([
    { 
      id: 'ORD-1001', 
      customer: 'John Doe', 
      date: '2023-06-15', 
      status: 'Processing', 
      items: 3, 
      total: 149.97, 
      payment: 'Paid', 
      shipping: 'Standard' 
    },
    { 
      id: 'ORD-1002', 
      customer: 'Jane Smith', 
      date: '2023-06-14', 
      status: 'Shipped', 
      items: 5, 
      total: 224.95, 
      payment: 'Paid', 
      shipping: 'Express' 
    },
    { 
      id: 'ORD-1003', 
      customer: 'Robert Johnson', 
      date: '2023-06-13', 
      status: 'Delivered', 
      items: 2, 
      total: 89.98, 
      payment: 'Paid', 
      shipping: 'Standard' 
    },
    { 
      id: 'ORD-1004', 
      customer: 'Emily Davis', 
      date: '2023-06-12', 
      status: 'Cancelled', 
      items: 1, 
      total: 29.99, 
      payment: 'Refunded', 
      shipping: 'Standard' 
    },
    { 
      id: 'ORD-1005', 
      customer: 'Michael Wilson', 
      date: '2023-06-11', 
      status: 'Processing', 
      items: 4, 
      total: 179.96, 
      payment: 'Pending', 
      shipping: 'Free' 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [selectedShipping, setSelectedShipping] = useState('All');
  const [viewOrder, setViewOrder] = useState(null);

  // Filter options
  const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const payments = ['All', 'Paid', 'Pending', 'Refunded', 'Failed'];
  const shippingMethods = ['All', 'Standard', 'Express', 'Free'];

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesPayment = selectedPayment === 'All' || order.payment === selectedPayment;
    const matchesShipping = selectedShipping === 'All' || order.shipping === selectedShipping;
    return matchesSearch && matchesStatus && matchesPayment && matchesShipping;
  });

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Processing': return <FiClock className="text-yellow-500" />;
      case 'Shipped': return <FiTruck className="text-blue-500" />;
      case 'Delivered': return <FiCheckCircle className="text-green-500" />;
      case 'Cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  return (
    <div className="p-8 transition-all duration-300">
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
              {orders.filter(order => order.status === 'Processing').length}
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
              {orders.filter(order => order.status === 'Shipped').length}
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
              {orders.filter(order => order.status === 'Delivered').length}
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
              placeholder="Search orders or customers..."
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
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
              {payments.map(payment => (
                <option key={payment} value={payment}>{payment}</option>
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
              {shippingMethods.map(method => (
                <option key={method} value={method}>{method}</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FiPrinter />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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
                <h2 className="text-xl font-bold">Order #{viewOrder.id}</h2>
                <p className="text-gray-500">Placed on {viewOrder.date}</p>
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
                <h3 className="font-medium text-gray-800 mb-2">Customer Information</h3>
                <p className="text-gray-600">{viewOrder.customer}</p>
                <p className="text-gray-600">customer@example.com</p>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
                <p className="text-gray-600">123 Main St</p>
                <p className="text-gray-600">Apt 4B</p>
                <p className="text-gray-600">New York, NY 10001</p>
                <p className="text-gray-600">United States</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Order Summary</h3>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${(viewOrder.total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Shipping ({viewOrder.shipping}):</span>
                  <span className="text-gray-800">${viewOrder.shipping === 'Express' ? '15.00' : viewOrder.shipping === 'Free' ? '0.00' : '5.00'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-800">${(viewOrder.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 mt-2">
                  <span className="font-medium text-gray-800">Total:</span>
                  <span className="font-medium text-gray-800">${viewOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Order Items</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(viewOrder.items)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          Sample Product {i + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${(viewOrder.total / viewOrder.items).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">1</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${(viewOrder.total / viewOrder.items).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Update Status</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateOrderStatus(viewOrder.id, 'Processing')}
                    className={`px-3 py-1 rounded-md text-sm ${viewOrder.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(viewOrder.id, 'Shipped')}
                    className={`px-3 py-1 rounded-md text-sm ${viewOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(viewOrder.id, 'Delivered')}
                    className={`px-3 py-1 rounded-md text-sm ${viewOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(viewOrder.id, 'Cancelled')}
                    className={`px-3 py-1 rounded-md text-sm ${viewOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
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