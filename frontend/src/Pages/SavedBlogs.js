import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Save_Blog, Saved_Blogs, Unsave_Blog } from "../Services/Api";
import { useSelector, useDispatch } from "react-redux";
import { setBlogId } from "../Redux/blogSlice.js";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout/AdminLayout.js";

const SavedBlogs = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user); // ✅ fixed
  const [savedBlogs, setSavedBlogs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get saved blogs
  const getSavedBlogs = async (token) => {
    try {
      const { data } = await Saved_Blogs(token);
      if (data) {
        setSavedBlogs(data?.savedBlogs || []);
      }
    } catch (err) {
      console.error("Fetch Saved Blogs Error:", err.response?.data || err.message);
      toast.error("Failed to load saved blogs");
    }
  };

  // handling toggle save
  const handleToggleSave = async (e, blogId) => {
    e.stopPropagation();
    try {
      if (savedBlogs.some((b) => b._id === blogId)) {
        // Already saved → unsave
        await Unsave_Blog(blogId, token);
        setSavedBlogs((prev) => prev.filter((b) => b._id !== blogId));
        toast.success("Removed from Saved Blogs!");
      } else {
        // Not saved → save
        const { data } = await Save_Blog(blogId, token);
        if (data?.savedBlogs) {
          setSavedBlogs(data.savedBlogs); // refresh from server
        } else {
          setSavedBlogs((prev) => [...prev, { _id: blogId }]); // fallback
        }
        toast.success("Added to Saved Blogs!");
      }
    } catch (err) {
      console.error("Toggle Save Error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    }
  };

  // Navigate to single blog
  const handleSingleBlog = (id) => {
    localStorage.setItem("blogId", id);
    dispatch(setBlogId(id));
    navigate("/single-blog");
  };

  // Fetch blogs on mount
  useEffect(() => {
    if (token) {
      getSavedBlogs(token);
    }
  }, [token]);

  const saved = (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Saved Blogs</h2>

      {savedBlogs.length === 0 ? (
        <p className="text-gray-500">There are no saved blogs</p>
      ) : (
        savedBlogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => handleSingleBlog(blog?._id)}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-lg transition"
          >
            {/* Left side: avatar + author + title */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Author row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {blog?.author?._id ? (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold border-2 border-[#4ECCA3] shadow-md">
                      {blog?.author?.name?.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold border-2 border-[#4ECCA3] shadow-md">
                      U
                    </div>
                  )}
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {blog?.author?.name || "Unknown Author"}
                  </span>
                </div>

                {/* Save/Unsave button */}
                {savedBlogs.some((b) => b._id === blog._id) ? (
                  <BookmarkCheck
                    onClick={(e) => handleToggleSave(e, blog._id)}
                    className="w-5 h-5 cursor-pointer text-green-600"
                    fill="currentColor"
                  />
                ) : (
                  <Bookmark
                    onClick={(e) => handleToggleSave(e, blog._id)}
                    className="w-5 h-5 cursor-pointer hover:text-green-500"
                  />
                )}
              </div>

              {/* Blog Title */}
              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {blog?.title || "Untitled Blog"}
              </h3>
            </div>

            {/* Right side: cover image */}
            {blog?.coverImage?.url && (
              <img
                src={blog.coverImage.url}
                alt={blog.title}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      {user?.role === "admin" ? (
        <AdminLayout>{saved}</AdminLayout>
      ) : (
        <Layout>{saved}</Layout>
      )}
    </>
  );
};

export default SavedBlogs;
