import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const admin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [chartGrouping, setChartGrouping] = useState('By Month');
  
  // State for all data
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };

  // Fetch admin data from backend
  useEffect(() => {
    const fetchadminData = async () => {
      try {
        setLoading(true);
        
        const token = getAuthToken();

        // Fetch all data in parallel with authentication headers
        const [statsRes, salesRes, trafficRes, productsRes, activityRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` },
            params: { range: timeRange }
          }),
          axios.get('http://localhost:3000/api/admin/sales', {
            headers: { Authorization: `Bearer ${token}` },
            params: { range: timeRange, groupBy: chartGrouping }
          }),
          axios.get('http://localhost:3000/api/admin/traffic', {
            headers: { Authorization: `Bearer ${token}` },
            params: { range: timeRange }
          }),
          axios.get('http://localhost:3000/api/admin/top-products', {
            headers: { Authorization: `Bearer ${token}` },
            params: { range: timeRange, limit: 5 }
          }),
          axios.get('http://localhost:3000/api/admin/recent-activity', {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 5 }
          })
        ]);

        // Transform stats data to match your UI format
        const transformedStats = [
          { 
            title: 'Total Revenue', 
            value: `$${statsRes.data.totalRevenue.toLocaleString()}`, 
            change: `${statsRes.data.revenueChange >= 0 ? '+' : ''}${statsRes.data.revenueChange.toFixed(1)}%`, 
            icon: <FiDollarSign className="text-xl sm:text-2xl" />, 
            color: 'bg-blue-100 text-blue-600' 
          },
          { 
            title: 'Total Orders', 
            value: statsRes.data.totalOrders.toLocaleString(), 
            change: `${statsRes.data.ordersChange >= 0 ? '+' : ''}${statsRes.data.ordersChange.toFixed(1)}%`, 
            icon: <FiShoppingCart className="text-xl sm:text-2xl" />, 
            color: 'bg-green-100 text-green-600' 
          },
          { 
            title: 'New Customers', 
            value: statsRes.data.newCustomers.toLocaleString(), 
            change: `${statsRes.data.customersChange >= 0 ? '+' : ''}${statsRes.data.customersChange.toFixed(1)}%`, 
            icon: <FiUsers className="text-xl sm:text-2xl" />, 
            color: 'bg-purple-100 text-purple-600' 
          },
          { 
            title: 'Conversion Rate', 
            value: `${statsRes.data.conversionRate.toFixed(1)}%`, 
            change: `${statsRes.data.conversionChange >= 0 ? '+' : ''}${statsRes.data.conversionChange.toFixed(1)}%`, 
            icon: <FiTrendingUp className="text-xl sm:text-2xl" />, 
            color: 'bg-orange-100 text-orange-600' 
          }
        ];

        setStats(transformedStats);
        setSalesData(salesRes.data);
        setTrafficData(trafficRes.data);
        setTopProducts(productsRes.data);
        setRecentActivity(activityRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setError('Failed to load admin data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchadminData();
  }, [timeRange, chartGrouping]);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 transition-all duration-300 lg:mt-0 mt-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500 text-lg sm:text-base" />
          <select 
            className="border border-gray-300 rounded-md px-3 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
            <div className={`rounded-full p-2 sm:p-3 mr-3 sm:mr-4 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">{stat.title}</p>
              <p className="text-lg sm:text-2xl font-bold my-1">{stat.value}</p>
              <p className="text-xs sm:text-sm flex items-center">
                <span className={`${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  <FiTrendingUp className="mr-1" /> {stat.change}
                </span>
                <span className="text-gray-400 ml-2">vs last period</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Revenue & Orders</h2>
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500 text-lg sm:text-base" />
            <select 
              className="border border-gray-300 rounded-md px-3 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
              value={chartGrouping}
              onChange={(e) => setChartGrouping(e.target.value)}
            >
              <option>By Month</option>
              <option>By Week</option>
              <option>By Day</option>
            </select>
          </div>
        </div>
        <div className="h-64 sm:h-80">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Traffic Sources</h2>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  sm:outerRadius={80}
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
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          <div className="h-56 sm:h-64">
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
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.event}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.user}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
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

export default admin;