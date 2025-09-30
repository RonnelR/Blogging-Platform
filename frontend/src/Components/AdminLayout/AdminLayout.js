import React, { useState } from "react";
import Footer from "../Footer";
import AdminHeader from "../AdminLayout/AdminHeader";
import AdminSidebar from "../AdminLayout/AdminSidebar";

const AdminLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header always on top */}
      <AdminHeader onMenuClick={() => setIsMobileOpen(true)} />

      {/* Sidebar + Content area */}
      <div className="flex flex-1">
        <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
