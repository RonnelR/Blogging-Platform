import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Upload } from "lucide-react";
import { Update_profile } from "../Services/Api";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice";
import toast from "react-hot-toast";

const ProfileModal = ({ isOpen, onClose, user, blogs }) => {
  const dispatch = useDispatch();

  // Redux user & token
  const User = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  // Timestamp to force avatar refresh
  const [photoTimestamp, setPhotoTimestamp] = useState(Date.now());

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    password: "",
  });

  const [photo, setPhoto] = useState(null); // file object
  const [preview, setPreview] = useState(user?.avatar || null); // UI   

  // Handle input change
  const handleChange = (e) =>   {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file); // actual file for backend
      setPreview(URL.createObjectURL(file)); // preview in UI
    }
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const id = User?._id;

      const formData = new FormData();
      formData.append("name", form.name);
     if (form.phoneNo && form.phoneNo.toString().trim() !== "") {
  formData.append("phoneNo", form.phoneNo);
}
      if (form.password) formData.append("password", form.password);
      if (photo) formData.append("photo", photo); // backend field

      const res = await Update_profile(formData, id, token);

     if (res?.data?.success) {
  dispatch(setUser({ user: res.data.updatedUser, token }));
  localStorage.setItem(
    "auth",
    JSON.stringify({ user: res.data.updatedUser, token })
  );

  setPhoto(null);                // clear selected file
  setPreview(null);              // clear preview
  setPhotoTimestamp(Date.now()); // refresh backend avatar

  toast.success(res.data.message || "Profile Updated! 🎉");
  // onClose();
}
 else {
        toast.error(res?.data?.message || "Profile update failed ❌");
      }
    } catch (error) {
      console.error("❌ Error during profile update:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-lg p-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-[#4ECCA3]">Your Profile</h2>
          <button onClick={onClose}>
            <X className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
           <div className="w-24 h-24 flex items-center justify-center bg-red-100 text-red-500 rounded-full text-2xl font-bold">
  {photo ? (
    // User just selected a new file, show preview
    <img
      src={preview}
      alt={user?.name}
      className="w-24 h-24 rounded-full object-cover border-4 border-[#4ECCA3] shadow-md"
    />
  ) : user?.photo?.data ? (
    // User has an avatar saved in DB, fetch from backend
    <img
      src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${user._id}?t=${photoTimestamp}`}
      alt={user?.name}
      className="w-24 h-24 rounded-full object-cover border-4 border-[#4ECCA3] shadow-md"
    />
  ) : (
    // No avatar, fallback to first letter
    user?.name?.charAt(0).toUpperCase() || "U"
  )}
</div>


            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 bg-[#4ECCA3] p-2 rounded-full cursor-pointer shadow-md"
            >
              <Upload size={16} className="text-gray-900" />
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Click to change avatar
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4ECCA3] bg-transparent text-gray-800 dark:text-white"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4ECCA3] bg-transparent text-gray-800 dark:text-white"
            />
            <input
              type="tel"
              name="phoneNo"
              value={form.phoneNo}
              onChange={handleChange}
              placeholder="Phone No"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4ECCA3] bg-transparent text-gray-800 dark:text-white"
            />
          </div>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#4ECCA3] bg-transparent text-gray-800 dark:text-white"
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#4ECCA3] text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-lg transition"
          >
            Update Profile
          </button>
        </form>

      </motion.div>
    </div>
  );
};

export default ProfileModal;
