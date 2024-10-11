import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faUserFriends, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../contexts/UserContext';

function Sidebar() {
  const { logoutUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  // Function to determine if a menu item is active
  const isActive = (path) => location.pathname === path;

  // Define menu items (you can add more items as needed)
  const menuItems = [
    { path: '/job-posting', icon: faBriefcase, text: 'Job Postings' },
    // Example of additional menu items:
    // { path: '/clients', icon: faUser, text: 'Clients' },
    // { path: '/sub-vendor', icon: faUserFriends, text: 'Sub Vendors' },
  ];

  return (
    <div className="bg-primary h-screen w-1/5 flex flex-col items-center">
      {/* Logo Section */}
      <Link to="/" className="w-full text-center">
        <h3 className="text-3xl font-bold text-white p-6">1HR</h3>
      </Link>

      {/* Navigation Menu and Logout Button */}
      <div className="flex flex-col w-full justify-between mb-8 h-full">
        {/* Navigation Menu */}
        <ul className="flex flex-col w-full space-y-6 mt-8">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-8 py-3 text-xl transition-all duration-300 ease-in-out ${
                  isActive(item.path)
                    ? 'bg-white text-primary'
                    : 'text-white hover:bg-white hover:text-primary'
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-4 text-2xl" />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center px-8 py-3 text-xl text-white hover:bg-white hover:text-primary transition-all duration-300 ease-in-out w-full"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-4 text-2xl" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
