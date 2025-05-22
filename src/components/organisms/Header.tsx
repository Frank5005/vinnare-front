import { FaShoppingBag } from "react-icons/fa";
import HamburgerMenu from "./HamburgerMenu";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { SearchBar } from "../molecules/SearchBar";
import { useCart } from "../../hooks/useCart";
import React from 'react';


const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const { totalItems, initialTotal  } = useCart();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
    localStorage.clear();

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
        <span
          className="font-bold text-lg mr-8 cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Tech Trend Emporium
        </span>
        {/* Desktop links */}
        <div className="hidden md:flex items-center flex-1 justify-between">
          <div className="flex items-center">
            <Link to="/shop-list" className="mx-2 text-sm font-medium !text-black hover:underline">Shop List</Link>
            <Link to="/wishlist" className="mx-2 text-sm font-medium !text-black hover:underline">Wishlist</Link>
            <div className="mx-4 flex-1 min-w-[300px]">
              <SearchBar />
            </div>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-4 ml-8">
              <div className="flex items-center cursor-pointer" onClick={() => navigate("/cart")}>
                <FaShoppingBag className="text-xl mr-1" />
                <span className="text-sm">{isLoggedIn ? initialTotal : totalItems}</span>
              </div>
              <span className="text-sm">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:underline bg-transparent !border-none outline-none shadow-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-8 text-sm font-medium text-black hover:underline bg-transparent !border-none outline-none shadow-none"
            >
              Login
            </button>
          )}
        </div>

        <HamburgerMenu isLoggedIn={isLoggedIn} userName={userName} cartCount={totalItems} />
      </nav>
    </header>
  );
};

export default Header;
