import React, { useState } from "react";

import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header always on top */}
      <Header onMenuClick={() => setIsMobileOpen(true)} />

      {/* Sidebar + Content area */}
      <div className="flex flex-1">
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
