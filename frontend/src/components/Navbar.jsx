// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center px-4 h-14">
      <div className="text-lg font-bold">Trademark Management</div>
      <div className="flex items-center space-x-4">
        <span>{user?.userId || 'User'}</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
