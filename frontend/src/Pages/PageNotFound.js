import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-bold text-[#4ECCA3] drop-shadow-lg"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4 text-lg md:text-2xl text-gray-300 dark:text-gray-700 text-center max-w-lg"
      >
        Oops! The page you’re looking for doesn’t exist.  
        It might have been removed or you may have typed the wrong link.
      </motion.p>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 rounded-2xl bg-[#4ECCA3] text-gray-900 font-semibold shadow-lg hover:shadow-xl transition"
      >
        Go Back Home
      </motion.button>
    </div>
  );
};

export default PageNotFound;
