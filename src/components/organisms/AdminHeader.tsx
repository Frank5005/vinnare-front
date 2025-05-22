import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from 'react';

const AdminHeader = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  return (
    <header>

      <div className="w-full bg-black text-white text-xs flex justify-between items-center px-4 md:px-10 py-1">
        <span className="mr-4 md:mr-8">USD</span>
        <span className="text-center flex-1">FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25–28.</span>
        <span className="ml-4 md:ml-8 text-right hidden md:inline">Support</span>
      </div>

      <nav className="w-full bg-gray-100 flex flex-col md:flex-row md:items-center px-4 md:px-10 py-2 border-b border-gray-300 relative gap-2 md:gap-0">

        <span
          className="hidden md:inline font-bold text-lg mb-2 md:mb-0 md:mr-8 cursor-pointer hover:underline whitespace-nowrap"
          onClick={() => navigate("/admin/homepage")}
        >
          Tech Trend Emporium
        </span>
       
        <div className="flex-1 flex items-center">
          <div className="flex items-center mx-auto max-w-xl bg-gray-100 rounded px-2 py-1 w-72">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent outline-none text-sm border-none"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 w-full justify-center md:justify-end ml-0 md:ml-8">
          <span className="text-sm">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:underline bg-transparent !border-none outline-none shadow-none"
          >
            Logout
          </button>
          <span className="bg-black text-white px-3 py-1 rounded font-medium text-xs md:text-sm whitespace-nowrap">
            Employee Portal
          </span>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader; 