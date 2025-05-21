import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiPlus, 
  FiRefreshCw, 
  FiAlertTriangle, 
  FiPackage, 
  FiFilter 
} from 'react-icons/fi';
import { 
  MdOutlineInventory2, 
  MdOutlineLowPriority 
} from 'react-icons/md';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Inventory() {

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [restockError, setRestockError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/api/all-products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const inventoryData = response.data.map(product => ({
          id: product._id,
          product: product.name.length > 25 ? `${product.name.slice(0, 25)}...` : product.name,
          sku: product._id.slice(-6).toUpperCase(),
          category: product.category?.name || 'Uncategorized',
          currentStock: product.stock || 0,
          lowStockThreshold: 10,
          status: getStockStatus(product.stock || 0, 10),
          image: product.image || { url: '' }
        }));
        
        setInventory(inventoryData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch inventory');
        setLoading(false);
        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again.');
        }
      }
    };

    fetchInventory();
  }, []);

  // Determine stock status
  const getStockStatus = (stock, threshold) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= threshold) return 'Low Stock';
    return 'In Stock';
  };

  // Get unique categories and statuses for filters
  const categories = ['All', ...new Set(inventory.map(item => item.category).filter(Boolean))];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRestock = (item) => {
    setRestockItem(item);
    setRestockQuantity('');
    setRestockError('');
    setShowRestockModal(true);
  };

  const submitRestock = async () => {
    if (!restockItem) {
      setRestockError('No item selected for restock');
      return;
    }

    const quantity = parseInt(restockQuantity);
    if (isNaN(quantity)) {
      setRestockError('Please enter a valid number');
      return;
    }
    if (quantity <= 0) {
      setRestockError('Quantity must be greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      setRestockError('');

      // Calculate new stock value
      const updatedStock = restockItem.currentStock + quantity;
      const token = getAuthToken();

      // Use dedicated stock endpoint with authentication
      const response = await axios.put(
        `${API_BASE_URL}/api/products/${restockItem.id}/stock`,
        { stock: updatedStock },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Stock update failed');
      }

      // Update local state
      setInventory(prevInventory => 
        prevInventory.map(item => 
          item.id === restockItem.id
            ? {
                ...item,
                currentStock: response.data.newStock || updatedStock,
                status: getStockStatus(response.data.newStock || updatedStock, item.lowStockThreshold)
              }
            : item
        )
      );

      toast.success('Inventory updated successfully');
      setShowRestockModal(false);
      setRestockQuantity('');
    } catch (err) {
      console.error('Restock error:', err);
      
      let errorMessage = 'Failed to update inventory. Please try again.';
      
      if (err.response) {
        if (err.response.data?.error?.details) {
          errorMessage = Object.values(err.response.data.error.details)
            .filter(Boolean)
            .join(', ');
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setRestockError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/api/all-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const inventoryData = response.data.map(product => ({
        id: product._id,
        product: product.name.length > 25 ? `${product.name.slice(0, 25)}...` : product.name,
        sku: product._id.slice(-6).toUpperCase(),
        category: product.category?.name || 'Uncategorized',
        currentStock: product.stock || 0,
        lowStockThreshold: 10,
        status: getStockStatus(product.stock || 0, 10),
        image: product.image || { url: '' }
      }));
      
      setInventory(inventoryData);
      toast.success('Inventory refreshed');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to refresh inventory');
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 transition-all duration-300">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={refreshInventory}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 transition-all duration-300 lg:mt-0 mt-8">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Inventory Management</h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button 
            onClick={refreshInventory}
            className="flex items-center justify-center w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            <FiRefreshCw className="mr-2" />
            Refresh Inventory
          </button>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-blue-100 text-blue-600">
            <MdOutlineInventory2 className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Total Products</p>
            <p className="text-xl sm:text-2xl font-bold my-1">{inventory.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-green-100 text-green-600">
            <FiPackage className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">In Stock</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {inventory.filter(item => item.status === 'In Stock').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-yellow-100 text-yellow-600">
            <FiAlertTriangle className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Low Stock</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {inventory.filter(item => item.status === 'Low Stock').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-red-100 text-red-600">
            <MdOutlineLowPriority className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Out of Stock</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {inventory.filter(item => item.status === 'Out of Stock').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products or SKU..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="(px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length > 0 ? (
                filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                          {item.image?.url ? (
                            <img 
                              src={item.image.url} 
                              alt={item.product} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <FiPackage />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.product}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lowStockThreshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleRestock(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No inventory items found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => (
                <div key={item.id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-md overflow-hidden">
                      {item.image?.url ? (
                        <img 
                          src={item.image.url} 
                          alt={item.product} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{item.product}</div>
                      <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span> {item.category}
                    </div>
                    <div>
                      <span className="text-gray-500">Stock:</span> {item.currentStock}
                    </div>
                    <div>
                      <span className="text-gray-500">Threshold:</span> {item.lowStockThreshold}
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : 
                          item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button 
                      onClick={() => handleRestock(item)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No inventory items found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Restock {restockItem?.product}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Add
                <span className="text-gray-500 ml-1">(Current: {restockItem?.currentStock})</span>
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                min="1"
                disabled={isSubmitting}
              />
              {restockError && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{restockError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRestockModal(false);
                  setRestockError('');
                }}
                disabled={isSubmitting}
                className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                onClick={submitRestock}
                disabled={isSubmitting}
                className={`cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Confirm Restock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;