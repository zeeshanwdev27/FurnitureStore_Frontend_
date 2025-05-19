import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingCart, FiUser, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  // Function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };

  // Fetch dashboard data
useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = getAuthToken();

      const [statsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:3000/api/analytics/stats', {
          params: { range: 'Last 7 Days' },
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3000/api/admin/orders', {
          params: { limit: 5 },
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

        // Transform stats data to match UI format
        const transformedStats = [
          { 
            title: 'Total Revenue', 
            value: `$${statsRes.data.totalRevenue.toLocaleString()}`, 
            change: `${statsRes.data.revenueChange >= 0 ? '+' : ''}${statsRes.data.revenueChange.toFixed(1)}%`, 
            icon: <FiDollarSign className="text-2xl" />, 
            color: 'bg-blue-100 text-blue-600' 
          },
          { 
            title: 'Total Orders', 
            value: statsRes.data.totalOrders.toLocaleString(), 
            change: `${statsRes.data.ordersChange >= 0 ? '+' : ''}${statsRes.data.ordersChange.toFixed(1)}%`, 
            icon: <FiShoppingCart className="text-2xl" />, 
            color: 'bg-green-100 text-green-600' 
          },
          { 
            title: 'New Customers', 
            value: statsRes.data.newCustomers.toLocaleString(), 
            change: `${statsRes.data.customersChange >= 0 ? '+' : ''}${statsRes.data.customersChange.toFixed(1)}%`, 
            icon: <FiUser className="text-2xl" />, 
            color: 'bg-purple-100 text-purple-600' 
          },
          { 
            title: 'Conversion Rate', 
            value: `${statsRes.data.conversionRate.toFixed(1)}%`, 
            change: `${statsRes.data.conversionChange >= 0 ? '+' : ''}${statsRes.data.conversionChange.toFixed(1)}%`, 
            icon: <FiTrendingUp className="text-2xl" />, 
            color: 'bg-orange-100 text-orange-600' 
          }
        ];

        setStats(transformedStats);
        setRecentOrders(ordersRes.data.orders);
        setError(null);
      } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      if (err.response?.status === 401) {
        // Token is invalid or expired
        setError('Session expired. Please log in again.');
        // You might want to redirect to login here
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Helper function to format order status
  const getStatusStyles = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // Handle Order ROute
  const handleOrderRoute = ()=>{
    navigate("/admin/orders")
  }

  const handleAddProducts = ()=>{
    navigate("/admin/products/add")
  }

  const handleAddUser = ()=>{
    navigate("/admin/users")
  }

  const handleReportRoute = ()=>{
    navigate("/admin/analytics")
  }

  const handleCreateDiscount =()=>{
    navigate("/admin/create-discount")
  }

  return (
    <div className="p-8 transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex items-start">
            <div className={`rounded-full p-3 mr-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold my-1">{stat.value}</p>
              <p className="text-sm flex items-center">
                <span className={`${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  <FiTrendingUp className="mr-1" /> {stat.change}
                </span>
                <span className="text-gray-400 ml-2">vs last period</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <button onClick={handleOrderRoute} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #ORD-{order._id.toString().slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.paymentInfo.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={handleAddProducts} className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-2">
              <FiShoppingCart className="text-xl" />
            </div>
            <span  className="text-sm font-medium">Add Product</span>
          </button>
          <button onClick={handleAddUser} className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-2">
              <FiUser className="text-xl" />
            </div>
            <span className="text-sm font-medium">Add Customer</span>
          </button>
          <button onClick={handleCreateDiscount} className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-2">
              <FiDollarSign className="text-xl" />
            </div>
            <span className="text-sm font-medium">Create Discount</span>
          </button>
          <button onClick={handleReportRoute} className="cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full mb-2">
              <FiTrendingUp className="text-xl" />
            </div>
            <span className="text-sm font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;