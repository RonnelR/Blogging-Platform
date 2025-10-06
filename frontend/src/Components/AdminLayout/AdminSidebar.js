import React from "react";
import {
  FilePlus, X, LayoutDashboard, Users, BookOpenText,
  Bookmark, BookCopy, ListCollapse
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, href: "/admin" },
    { name: "New Blog", icon: <FilePlus size={22} />, href: "/new-blog" },
    { name: "All Users", icon: <Users size={22} />, href: "/all-users" },
    { name: "All Blogs", icon: <BookCopy size={22} />, href: "/all-blogs" },
    { name: "Categories", icon: <ListCollapse size={22} />, href: "/category" },
    { name: "Your Blogs", icon: <BookOpenText size={22} />, href: "/your-blogs" },
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
  className={`
    bg-white dark:bg-gray-900 shadow-lg w-64 transition-transform duration-300
    md:fixed md:top-16 md:bottom-16 md:left-0
    fixed top-0 bottom-0 left-0 z-50 md:z-40
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
>
  {/* Mobile close button */}
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 md:hidden">
    <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Blog Menu</span>
    <button
      className="text-gray-600 dark:text-gray-300"
      onClick={() => setIsMobileOpen(false)}
    >
      <X size={22} />
    </button>
  </div>

  {/* Navigation */}
  <nav className="mt-4 space-y-2 px-2 overflow-y-auto h-full">
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

export default AdminSidebar;
