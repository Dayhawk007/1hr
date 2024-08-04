import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-gray-800 h-screen flex flex-col">
      <div className="flex items-center p-4">
        {/* Logo or app name */}
      </div>
      <ul className="flex flex-col gap-4">
        <li>
          <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor"  height={"24px"} width={"24px"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v10"></path></svg>
            <span className="ml-2">Dashboard</span>
          </Link>
        </li>
        <li>
          {/* Another menu item */}
        </li>
        <li>
          {/* Another menu item */}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
