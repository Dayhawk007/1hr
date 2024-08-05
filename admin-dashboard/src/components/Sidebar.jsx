import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faUser,faUserFriends } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <div className="bg-gray-800 h-screen space-y-8 flex flex-col items-center">
      <Link to="/" >
        <h3 className="text-3xl font-bold text-white p-6">1HR</h3>
      </Link>
      <ul className="flex flex-col gap-8 px-6 p-4 justify-center text-xl">
        <li>
          <Link to="/client" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <FontAwesomeIcon icon={faUser} />
            <span className="ml-2">Clients</span>
          </Link>
        </li>
        <li>
          <Link to="/sub-vendor" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <FontAwesomeIcon icon={faUserFriends} />
            <span className="ml-2">Sub vendors</span>
          </Link>
        </li>
        <li>
        <Link to="/job-postings" className="flex items-center p-2 rounded-md hover:bg-gray-700">
            <FontAwesomeIcon icon={faBriefcase} />
            <span className="ml-2">Job postings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
