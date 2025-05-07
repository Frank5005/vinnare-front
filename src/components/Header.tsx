//import { useState } from "react";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import HamburgerMenu from "./ui/HamburgerMenu";
import { Link } from "react-router-dom";

const isLoggedIn = true;
const userName = "Jengrik";
const cartCount = 3;

const Header = () => {
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
  <span className="font-bold text-lg mr-8">Tech Trend Emporium</span>
  {/* Desktop links */}
  <div className="hidden md:flex items-center flex-1 justify-between">
    <div className="flex items-center">
      <Link to="/shop-list" className="mx-2 text-sm font-medium !text-black hover:underline">Shop List</Link>
      <Link to="/wishlist" className="mx-2 text-sm font-medium !text-black hover:underline">Wishlist</Link>
      <div className="flex items-center mx-4 max-w-xl bg-gray-100 rounded px-2 py-1">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent outline-none text-sm border-none"
        />
      </div>
    </div>
    {isLoggedIn ? (
      <div className="flex items-center gap-4 ml-8">
        <div className="flex items-center">
          <FaShoppingBag className="text-xl mr-1" />
          <span className="text-sm">{cartCount}</span>
        </div>
        <span className="text-sm">{userName}</span>
        <a href="#" className="text-sm font-medium hover:underline">Logout</a>
      </div>
    ) : (
      <a href="#" className="ml-8 text-sm font-medium text-black hover:underline">Login</a>
    )}
  </div>
  {/* Menú hamburguesa para mobile */}
  <HamburgerMenu isLoggedIn={isLoggedIn} userName={userName} cartCount={cartCount} />
</nav>
    </header>
  );
};

export default Header;
