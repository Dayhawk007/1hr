import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
