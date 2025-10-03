import React from "react";
import { House, FilePlus, BookOpen, Bookmark, X } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { name: "Home", icon: <House size={22} />, href: "/blogs" },
    { name: "New Blog", icon: <FilePlus size={22} />, href: "/new-blog" },
    { name: "Your Blogs", icon: <BookOpen size={22} />, href: "/your-blogs" },
    { name: "Saved Blogs", icon: <Bookmark size={22} />, href: "/saved-blogs" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <aside
         className={`bg-white dark:bg-gray-900 shadow-lg
    w-64 z-50 transition-transform duration-300
    md:relative md:translate-x-0
    fixed top-0 left-0 h-full
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
  `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Blog Menu
          </span>
          <button
            className="text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-2 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
