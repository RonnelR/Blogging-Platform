// Blogs.js
import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import {
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Search,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  All_Blogs,
  Save_Blog,
  Saved_Blogs,
  Unsave_Blog,
  Like_Blog,
  Unlike_Blog,
} from "../Services/Api.js";
import { useNavigate } from "react-router-dom";
import { setBlogId } from "../Redux/blogSlice.js";
import toast from "react-hot-toast";

const Blogs = () => {
  const User = useSelector((state) => state.user);
  const token = User?.token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch all blogs
  const fetchAllBlogs = async () => {
    try {
      const { data } = await All_Blogs(token);
      if (data?.allBlogs) {
        setBlogs(data.allBlogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to load blogs");
    }
  };

  // Fetch saved blogs
  const fetchSavedBlogs = async () => {
    try {
      const { data } = await Saved_Blogs(token);
      if (data?.success) {
        setSavedBlogs(data.savedBlogs.map((b) => b._id)); // only IDs
      }
    } catch (err) {
      console.error("Error fetching saved blogs:", err);
    }
  };

  // Navigate to single blog
  const handleSingleBlog = (id) => {
    localStorage.setItem("blogId", id);
    dispatch(setBlogId(id));
    navigate("/single-blog");
  };

  // Toggle Save / Unsave
  const handleToggleSave = async (e, blogId) => {
    e.stopPropagation();
    try {
      if (savedBlogs.includes(blogId)) {
        await Unsave_Blog(blogId, token);
        setSavedBlogs((prev) => prev.filter((id) => id !== blogId));
        toast.success("Removed from Saved Blogs!");
      } else {
        await Save_Blog(blogId, token);
        setSavedBlogs((prev) => [...prev, blogId]);
        toast.success("Added to Saved Blogs!");
      }
    } catch (err) {
      console.error("Toggle Save Error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    }
  };

  // Toggle Like / Unlike
  const handleToggleLike = async (e, blogId) => {
    e.stopPropagation();
    try {
      // Optimistic UI update
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likes: blog.likes.includes(User?.user?._id)
                  ? blog.likes.filter((id) => id !== User?.user?._id)
                  : [...blog.likes, User?.user?._id],
              }
            : blog
        )
      );

      // API call
      if (
        blogs.find((b) => b._id === blogId)?.likes.includes(User?.user?._id)
      ) {
        await Unlike_Blog(blogId, token);
      } else {
        await Like_Blog(blogId, token);
      }
    } catch (err) {
      console.error("Like/Unlike Error:", err.response?.data || err.message);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllBlogs();
      fetchSavedBlogs();
    }
    // eslint-disable-next-line
  }, [token]);

  // 👉 Extract categories dynamically
  const categories = ["All", ...new Set(blogs.map((b) => b?.category?.name))];

  // 👉 Filter blogs (search + category)
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog?.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog?.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog?.tags?.some((tag) =>
        tag?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      blog?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || blog?.category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Search + Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="flex items-center border-2 border-gray-400 bg-gray-300 dark:bg-gray-500 rounded-xl px-3 py-1 md:w-1/2">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-bold mb-4">All Blogs</h2>

        {filteredBlogs.length === 0 ? (
          <p className="text-gray-500">No Blogs found</p>
        ) : (
          filteredBlogs.map((blog) => (
            <div
              onClick={() => handleSingleBlog(blog._id)}
              key={blog._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 flex flex-col gap-4 cursor-pointer transition hover:shadow-lg"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {blog?.author?._id ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${blog.author._id}?t=${Date.now()}`}
                      alt={blog.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#4ECCA3] shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold border-2 border-[#4ECCA3] shadow-md">
                      {blog?.author?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {blog?.author?.name}
                  </span>
                </div>
              </div>

              {/* Middle Row */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {blog.excerpt}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {blog?.category?.name}
                  </p>
                </div>

                {blog?.coverImage?.url && (
                  <img
                    src={blog.coverImage.url}
                    alt={blog.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-5">
                  {/* Like */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => handleToggleLike(e, blog._id)}
                  >
                    {blog.likes.includes(User?.user?._id) ? (
                      <Heart className="w-5 h-5 cursor-pointer fill-red-500 hover:text-red-500" />
                    ) : (
                      <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
                    )}
                    <span>{blog.likes.length}</span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-5 h-5 cursor-pointer hover:text-blue-500" />
                    <span>{blog.comments?.length || 0}</span>
                  </div>
                </div>

                {/* Save / Unsave */}
                {savedBlogs.includes(blog._id) ? (
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
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Blogs;
