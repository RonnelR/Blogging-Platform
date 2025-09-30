import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-100 border-t border-gray-700 dark:border-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#4ECCA3]">Italics</span>. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
