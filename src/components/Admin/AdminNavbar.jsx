import React, { useState, useEffect, useRef } from 'react';
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
  // Set initial sidebar state based on screen size (open for lg and above)
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024); // lg breakpoint
  const location = useLocation();
  const sidebarRef = useRef(null);

  const navItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/allproducts', icon: <FiShoppingBag />, label: 'Products' },
    { path: '/admin/inventory', icon: <MdInventory />, label: 'Inventory' },
    { path: '/admin/orders', icon: <MdLocalShipping />, label: 'Orders' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { path: '/admin/analytics', icon: <FiPieChart />, label: 'Analytics' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  // Handle clicks outside the sidebar for small and medium screens
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar when clicking nav items on small and medium screens
  const handleNavClick = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      {!sidebarOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-indigo-600 text-white"
          >
            <FiMenu size={24} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed lg:relative z-40 w-64 bg-indigo-800 text-white h-full transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'left-0' : '-left-64 lg:left-0 lg:w-20'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-indigo-700 h-16">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <h1 className="text-xl font-bold">AP</h1>
          )}
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1 rounded-lg hover:bg-indigo-700"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-white"
            >
              <FiX size={24} />
            </button>
          </div>
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
              onClick={handleNavClick}
            />
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <Link 
            to="/admin/logout" 
            className="flex items-center p-2 text-white hover:bg-indigo-700 rounded-lg"
            onClick={handleNavClick}
          >
            <FiLogOut />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </>
  );
}

const NavLink = ({ to, icon, label, active, sidebarOpen, onClick }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center p-3 mx-2 my-1 rounded-lg transition-colors
        ${active ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
    >
      <span className="text-lg">{icon}</span>
      {sidebarOpen && <span className="ml-3">{label}</span>}
    </Link>
  );
};

export default AdminNavbar;