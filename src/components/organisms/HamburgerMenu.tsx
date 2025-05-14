import { useState } from "react";
import { FaBars, FaTimes, FaSearch, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { SearchBar } from "../molecules/SearchBar";

const HamburgerMenu = ({
  isLoggedIn,
  userName,
  cartCount,
}: {
  isLoggedIn: boolean;
  userName?: string;
  cartCount?: number;
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="md:hidden ml-auto relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
        className="text-2xl text-gray-700 focus:outline-none bg-transparent p-0 border-none shadow-none"
        style={{ background: "none", boxShadow: "none", border: "none" }}
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
              style={{ background: "none", boxShadow: "none", border: "none" }}
            >
              <FaTimes />
            </button>
            <nav className="flex flex-col gap-4 px-6 py-4">
              {/* SearchBar */}
              <div className="flex items-center bg-gray-100 rounded px-2 py-2">
                <SearchBar />
              </div>
              {isLoggedIn && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    navigate("/cart");
                  }}
                >
                  <FaShoppingBag className="text-xl" />
                  <span className="text-sm">{cartCount}</span>
                  <span className="text-sm">{userName}</span>
                </div>
              )}
              <button
                className="text-base font-medium text-black hover:underline text-left bg-transparent border-none p-0 shadow-none outline-none"
                style={{ background: "none", boxShadow: "none", border: "none" }}
                onClick={() => handleNavigate("/shop-list")}
              >
                Shop List
              </button>
              <button
                className="text-base font-medium text-black hover:underline text-left bg-transparent border-none p-0 shadow-none outline-none"
                style={{ background: "none", boxShadow: "none", border: "none" }}
                onClick={() => handleNavigate("/wishlist")}
              >
                Wishlist
              </button>
              {isLoggedIn ? (
                <button
                  className="text-base font-medium text-black hover:underline text-left bg-transparent border-none p-0 shadow-none outline-none"
                  style={{ background: "none", boxShadow: "none", border: "none" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="text-base font-medium text-black hover:underline text-left bg-transparent border-none p-0 shadow-none outline-none"
                  style={{ background: "none", boxShadow: "none", border: "none" }}
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;