// components/adminNavbar/AdminNavbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiPieChart,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { MdInventory, MdLocalShipping } from 'react-icons/md';

function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/allproducts', icon: <FiShoppingBag />, label: 'Products' },
    { path: '/admin/inventory', icon: <MdInventory />, label: 'Inventory' },
    { path: '/admin/orders', icon: <MdLocalShipping />, label: 'Orders' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-indigo-600 text-white"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-40 w-64 bg-indigo-800 text-white h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'left-0' : '-left-64 md:left-0 md:w-20'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700 h-16">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold">FA</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block p-1 rounded-lg hover:bg-indigo-700"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <Link 
            to="/logout" 
            className="flex items-center p-2 text-white hover:bg-indigo-700 rounded-lg"
          >
            <FiLogOut />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </>
  );
}

const NavLink = ({ to, icon, label, active, sidebarOpen }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center p-3 mx-2 my-1 rounded-lg transition-colors
        ${active ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
    >
      <span className="text-lg">{icon}</span>
      {sidebarOpen && <span className="ml-3">{label}</span>}
    </Link>
  );
};

export default AdminNavbar;