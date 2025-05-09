import { FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      {/* Top black bar */}
      <div className="w-full bg-black text-white text-xs flex justify-between items-center px-10 py-1">
        <span className="mr-8">USD</span>
        <span className="text-center flex-1">FREE SHIPPING ON ALL HERMAN MILLER! FEB. 25–28.</span>
        <span className="ml-8 text-right hidden md:inline">Support</span>
      </div>
      {/* Main navigation bar */}
      <nav className="w-full bg-gray-100 flex items-center px-10 py-2 border-b border-gray-300 relative">
        {/* Logo */}
        <span
          className="font-bold text-lg mr-8 cursor-pointer hover:underline"
          onClick={() => navigate("/admin-employee-homepage")}
        >
          Tech Trend Emporium
        </span>
        {/* Search */}
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
        {/* User info and Employee Portal */}
        <div className="flex items-center gap-4 ml-8">
          <span className="text-sm">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:underline bg-transparent !border-none outline-none shadow-none"
          >
            Logout
          </button>
          <span className="bg-black text-white px-4 py-2 rounded font-medium ml-2 text-sm">Employee Portal</span>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader; 