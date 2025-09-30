import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../Services/Api.js";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const res = await resetPassword(token, { password });
      if (res?.data?.success) {
        toast.success("Password reset successful ✅");
        navigate("/login");
      } else {
        toast.error(res?.data?.message || "Reset failed ❌");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-[#4ECCA3] text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
