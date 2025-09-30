import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Spinner = () => {
  const [time, setTime] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (time === 0) {
      navigate("/login");
      return;
    }

    const interval = setInterval(() => {
      setTime((prevValue) => prevValue - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Spinner Circle */}
      <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>

      {/* Countdown text */}
      <p className="mt-6 text-lg font-medium text-gray-200">
        Redirecting to <span className="font-semibold text-red-400">Login</span>{" "}
        in {time} seconds...
      </p>
    </div>
  );
};

export default Spinner;
