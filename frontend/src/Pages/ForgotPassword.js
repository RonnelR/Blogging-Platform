import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BrandNname from "../Assects/logo_green.png";
import { forgotPassword } from "../Services/Api.js"; // 👈 your API service
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      if (res?.data?.success) {
        toast.success(res.data.message || "Recovery email sent ✅");
        setEmail("");
        navigate("/login");
      } else {
        toast.error(res?.data?.message || "Something went wrong ❌");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toast.error("Failed to send recovery email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
      {/* Brand Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <img
          onClick={() => navigate("/")}
          src={BrandNname}
          alt="Brand logo"
          className="h-12 w-auto object-contain cursor-pointer"
        />
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
          Enter your registered email, and we’ll send you a recovery link.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECCA3] mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4ECCA3] text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          {loading ? "Sending..." : "Send Recovery Link"}
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Remembered your password?{" "}
          <span
            className="text-[#4ECCA3] font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default ForgotPassword;
    