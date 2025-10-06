import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, PenLine, User, PlusCircle, LogOut } from "lucide-react";
import ProfileModal from "../Pages/Profile";
import BrandNname from "../Assects/logo_green.png";
import { useSelector } from "react-redux";

const Header = ({ onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("blogId");
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <>
      <header className="h-16 w-full sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4">
          {/* Left: Mobile menu + brand */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white dark:text-gray-800"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>

            <Link to="/blogs" className="flex items-center">
              <img
                src={BrandNname}
                alt="Brand logo"
                className="h-12 w-auto object-contain"
                style={{ minWidth: "120px" }}
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <Link
              to="/new-blog"
              className="hidden md:flex items-center gap-2 text-white dark:text-gray-800 hover:text-[#4ECCA3] transition"
            >
              <PenLine size={18} />
              Write
            </Link>

            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-500 rounded-full text-2xl font-bold">
                  {user?.photo?.data ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${user._id}?t=${Date.now()}`}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#4ECCA3] shadow-md"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-2 animate-fadeIn">
                  <button
                    onClick={() => {
                      setProfileOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User size={18} /> Profile
                  </button>

                  <Link
                    to="/new-blog"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                  >
                    <PlusCircle size={18} /> New Blog
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
      />
    </>
  );
};

export default Header;
