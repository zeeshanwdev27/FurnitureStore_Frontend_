// components/layouts/AdminLayout.jsx
import React from 'react';
import AdminNavbar from "../Admin/AdminNavbar.jsx";

function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar will be included via AdminNavbar */}
      <AdminNavbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content will be rendered here */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;