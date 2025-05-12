import React from 'react';
import { FiDollarSign, FiShoppingCart, FiUser, FiTrendingUp } from 'react-icons/fi';

function AdminDashboard() {
  // Sample data - replace with real data from your backend
  const stats = [
    { title: 'Total Revenue', value: '$12,345', change: '+12%', icon: <FiDollarSign className="text-2xl" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Orders', value: '1,234', change: '+5%', icon: <FiShoppingCart className="text-2xl" />, color: 'bg-green-100 text-green-600' },
    { title: 'New Customers', value: '56', change: '+8%', icon: <FiUser className="text-2xl" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: <FiTrendingUp className="text-2xl" />, color: 'bg-orange-100 text-orange-600' },
  ];

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
                <span className="text-green-500 flex items-center">
                  <FiTrendingUp className="mr-1" /> {stat.change}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
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
              {[1, 2, 3, 4, 5].map((order) => (
                <tr key={order}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-{1000 + order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Customer {order}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order % 3 === 0 ? 'bg-green-100 text-green-800' : 
                        order % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order % 3 === 0 ? 'Delivered' : order % 2 === 0 ? 'Processing' : 'Shipped'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-{10 + order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(100 + order * 25).toFixed(2)}</td>
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
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-2">
              <FiShoppingCart className="text-xl" />
            </div>
            <span className="text-sm font-medium">Add Product</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-2">
              <FiUser className="text-xl" />
            </div>
            <span className="text-sm font-medium">Add Customer</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-2">
              <FiDollarSign className="text-xl" />
            </div>
            <span className="text-sm font-medium">Create Discount</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center">
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