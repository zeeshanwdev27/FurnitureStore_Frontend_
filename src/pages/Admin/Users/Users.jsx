import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiUser,
  FiMail,
  FiLock,
  FiCalendar
} from 'react-icons/fi';
import { BsShieldLock, BsPersonCheck, BsPersonX } from 'react-icons/bs';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Filter options
  const roles = ['All', 'Admin', 'Editor', 'Customer'];
  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];

  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  };

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditMode(true);
    setShowUserModal(true);
  };

  const handleAddUser = () => {
    setCurrentUser({
      username: '',
      email: '',
      role: 'Customer',
      status: 'Active'
    });
    setPassword('');
    setIsEditMode(false);
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    try {
      let response;
      const token = getAuthToken();

      if (isEditMode) {
        // Update existing user
        response = await axios.put(
          `${API_BASE_URL}/api/admin/users/${currentUser._id}`,
          currentUser, {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // If user is being suspended, show confirmation
        if (currentUser.status === 'Suspended') {
          toast.warning(`${currentUser.username} has been suspended and can no longer log in.`);
        }
        
        // Update local state
        setUsers(users.map(user => 
          user._id === currentUser._id ? response.data.user : user
        ));
        
        toast.success('User updated successfully');
      } else {
        // Add new user
        const userData = {
          ...currentUser,
          password
        };
        
        response = await axios.post(
          `${API_BASE_URL}/api/admin/users`,
          userData, {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Add to local state
        setUsers([...users, response.data.user]);
        toast.success('User added successfully');
      }
      
      setShowUserModal(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save user';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    const token = getAuthToken();
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete user';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return <BsPersonCheck className="text-green-500" />;
      case 'Inactive': return <BsPersonX className="text-gray-500" />;
      case 'Suspended': return <BsShieldLock className="text-red-500" />;
      default: return <BsPersonX className="text-gray-500" />;
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
      <div className="p-4 sm:p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 transition-all duration-300 lg:mt-0 mt-8">
      {/* Toast Container */}
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">User Management</h1>
        <button 
          onClick={handleAddUser}
          className="flex items-center justify-center w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          <FiUserPlus className="mr-2" />
          Add User
        </button>
      </div>

      {/* Users Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-blue-100 text-blue-600">
            <FiUser className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Total Users</p>
            <p className="text-xl sm:text-2xl font-bold my-1">{users.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-green-100 text-green-600">
            <BsPersonCheck className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Active</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {users.filter(user => user.status === 'Active').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-gray-100 text-gray-600">
            <BsPersonX className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Inactive</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {users.filter(user => user.status === 'Inactive').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start">
          <div className="rounded-full p-3 mr-4 bg-red-100 text-red-600">
            <BsShieldLock className="text-xl sm:text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm">Suspended</p>
            <p className="text-xl sm:text-2xl font-bold my-1">
              {users.filter(user => user.status === 'Suspended').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            {/* Status Filter */}
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiUser className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role || 'Customer'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(user.status)}
                        <span className={`ml-2 ${user.status === 'Suspended' ? 'text-red-600 font-semibold' : ''}`}>
                          {user.status || 'Active'}
                        </span>
                        {user.status === 'Suspended' && (
                          <span className="ml-2 text-xs text-red-500">(Cannot login)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Role:</span> 
                      <span className="font-medium">{user.role || 'Customer'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Status:</span>
                      <span className={`font-medium ${user.status === 'Suspended' ? 'text-red-600' : ''}`}>
                        {user.status || 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Joined:</span> 
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Last Login:</span> 
                      <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h2>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={currentUser?.username || ''}
                  onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={currentUser?.email || ''}
                  onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={currentUser?.role || 'Customer'}
                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={currentUser?.status || 'Active'}
                    onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Set password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                {isEditMode ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;