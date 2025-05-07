import { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaShoppingBag } from "react-icons/fa";

const HamburgerMenu = ({ isLoggedIn, userName, cartCount }: {
  isLoggedIn: boolean;
  userName?: string;
  cartCount?: number;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden ml-auto relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
        className="text-2xl text-gray-700 focus:outline-none bg-transparent p-0 border-none shadow-none"
        style={{ background: 'none', boxShadow: 'none', border: 'none' }}
      >
        <FaBars />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex">
          {/* Panel lateral */}
          <div className="ml-auto w-3/4 max-w-xs h-full bg-gray-100 shadow-lg flex flex-col">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-3xl text-gray-700 self-end focus:outline-none bg-transparent p-0 border-none shadow-none mt-4 mr-4"
              style={{ background: 'none', boxShadow: 'none', border: 'none' }}
            >
              <FaTimes />
            </button>
            <nav className="flex flex-col gap-4 px-6 py-4">
              <div className="flex items-center bg-gray-100 rounded px-2 py-2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent outline-none text-sm border-none"
                />
              </div>
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <FaShoppingBag className="text-xl" />
                  <span className="text-sm">{cartCount}</span>
                  <span className="text-sm">{userName}</span>
                </div>
              )}
              <a href="#" className="text-base font-medium text-black hover:underline">Shop List</a>
              <a href="#" className="text-base font-medium text-black hover:underline">Wishlist</a>
              <a href="#" className="text-base font-medium text-black hover:underline">Support</a>
              {isLoggedIn ? (
                <a href="#" className="text-base font-medium text-black hover:underline">Logout</a>
              ) : (
                <a href="#" className="text-base font-medium text-black hover:underline">Login</a>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;