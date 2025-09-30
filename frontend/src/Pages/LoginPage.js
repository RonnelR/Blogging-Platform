import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BrandNname from "../Assects/logo_green.png";
import {login} from '../Services/Api.js';
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice.js";



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "",});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const res = await login(form); // call your API
    
        if (res?.data?.success) {
            localStorage.setItem('auth',JSON.stringify(res?.data))
           dispatch(setUser({ user: res?.data?.user, token: res?.data?.token }));
          toast.success(res.data.message || "login successful 🎉");
          console.log("✅ login successful" ,res?.data);
        
       
           navigate(`/${res?.data.user?.role === 'admin' ? "admin" : "blogs"}` );
        } else {
          toast.error(res?.data?.message || "login failed ❌");
          console.log("⚠️ login failed");
        }
      } catch (error) {
        console.error("❌ Error during login:", error);
        toast.error("Something went wrong. Please try again later.");
      }
   
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
      {/* Brand */}

  

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-[#4ECCA3] mb-8"
      >
        <img
              onClick={()=>navigate('/')}
              src={BrandNname}
              alt="Italics brand logo"
              className="h-12 w-auto object-contain" // increase h-10 → h-12 (or h-14)
              style={{ minWidth: "120px" }} // optional: force it to look wider
            />
      </motion.h1>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ECCA3]"
            required
          />

           <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Forgot Password?{" "}
          <span
            className="text-[#4ECCA3] font-semibold cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </span>
        </p>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-[#4ECCA3] text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-[#4ECCA3] font-semibold cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Registers
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
