import React from 'react';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingCart, 
  FiDollarSign,
  FiCalendar,
  FiFilter
} from 'react-icons/fi';
import { 
  LineChart, 
  BarChart, 
  PieChart,
  Line, 
  Bar, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  // Demo data - replace with real API data later
  const salesData = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 139 },
    { name: 'Mar', revenue: 5000, orders: 480 },
    { name: 'Apr', revenue: 2780, orders: 390 },
    { name: 'May', revenue: 6890, orders: 430 },
    { name: 'Jun', revenue: 8000, orders: 520 },
    { name: 'Jul', revenue: 8500, orders: 610 },
  ];

  const trafficData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Referral', value: 200 },
    { name: 'Organic', value: 100 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 240 },
    { name: 'Smart Watch', sales: 189 },
    { name: 'Leather Wallet', sales: 152 },
    { name: 'Cotton T-Shirt', sales: 110 },
    { name: 'Running Shoes', sales: 95 },
  ];

  const stats = [
    { title: 'Total Revenue', value: '$32,450', change: '+12.5%', icon: <FiDollarSign className="text-2xl" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Orders', value: '2,850', change: '+8.3%', icon: <FiShoppingCart className="text-2xl" />, color: 'bg-green-100 text-green-600' },
    { title: 'New Customers', value: '456', change: '+5.2%', icon: <FiUsers className="text-2xl" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Conversion Rate', value: '3.8%', change: '+1.2%', icon: <FiTrendingUp className="text-2xl" />, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="p-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <select className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

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
                <span className="text-gray-400 ml-2">vs last period</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Revenue & Orders</h2>
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <select className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>By Month</option>
              <option>By Week</option>
              <option>By Day</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4f46e5" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
                name="Revenue ($)" 
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Orders" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Traffic Sources</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Pie 
                      key={`cell-${index}`} 
                      fill={['#4f46e5', '#8b5cf6', '#10b981', '#3b82f6'][index % 4]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar 
                  dataKey="sales" 
                  name="Sales" 
                  radius={[4, 4, 0, 0]}
                >
                  {topProducts.map((entry, index) => (
                    <Bar 
                      key={`cell-${index}`} 
                      fill={['#4f46e5', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'][index % 5]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { event: 'New Order #10025', user: 'John Doe', time: '10 min ago', status: 'Completed' },
                { event: 'Payment Received', user: 'Jane Smith', time: '25 min ago', status: 'Processed' },
                { event: 'New User Registered', user: 'Robert Johnson', time: '1 hour ago', status: 'Active' },
                { event: 'Order #10024 Shipped', user: 'Emily Davis', time: '2 hours ago', status: 'Shipped' },
                { event: 'Refund Processed', user: 'Michael Wilson', time: '3 hours ago', status: 'Completed' },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Processed' ? 'bg-blue-100 text-blue-800' : 
                        item.status === 'Active' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;