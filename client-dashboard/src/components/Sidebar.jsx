import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser, faUserFriends, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../contexts/UserContext';


function Sidebar() {
  const { logoutUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <div className="bg-primary h-screen space-y-8 flex flex-col items-center">
      <Link to="/" >
        <h3 className="text-3xl font-bold text-white p-6">1HR</h3>
      </Link>
      <ul className="flex flex-col gap-8 px-6 p-4 items-center justify-center text-xl">
        <li>
        <Link to="/job-posting" className="flex items-center px-4 py-2 rounded-md hover:bg-white hover:text-black">
            <FontAwesomeIcon icon={faBriefcase} />
            <span className="ml-2">Job postings</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 rounded-md hover:bg-white hover:text-black">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="ml-2">Log out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

