import React, { useEffect, useState } from "react";
import AdminLayout from "../../Components/AdminLayout/AdminLayout";
import { Search, Trash2 } from "lucide-react";
import {
  All_Blogs,
  All_Categories,
  Delete_Blog,
  Delete_User,
} from "../../Services/Api";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { setBlogId } from "../../Redux/blogSlice";

const AllBlogs = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [deleteType, setDeleteType] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // Navigate to single blog
  const handleSingleBlog = (id) => {
    localStorage.setItem("blogId", id);
    dispatch(setBlogId(id));
    navigate("/single-blog");
  };

  // Fetch all blogs
  const fetchAllBlogs = async () => {
    try {
      const { data } = await All_Blogs(token);
      if (data?.allBlogs) {
        setBlogs(data.allBlogs);
      }
    } catch (err) {
      toast.error(`Error fetching blogs: ${err.message}`);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await All_Categories(token);
      if (data?.categories) {
        setAllCategories(data.categories);
      } else {
        toast.error("No categories available");
      }
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchAllBlogs();
    fetchCategories();
    //eslint-disable-next-line
  }, []);

  // Open delete modal
  const openDeleteModal = (id, e, type) => {
    e.stopPropagation();
    if (type === "blog") {
      setSelectedBlogId(id);
      setDeleteType("blog");
    } else {
      setSelectedUserId(id);
      setDeleteType("user");
    }
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (deleteType === "blog" && selectedBlogId) {
        const { data } = await Delete_Blog(selectedBlogId, token);
        if (data?.success) {
          toast.success("Blog deleted!");
          setBlogs((prev) => prev.filter((b) => b._id !== selectedBlogId));
        }
      } else if (deleteType === "user" && selectedUserId) {
        const { data } = await Delete_User(selectedUserId, token);
        if (data?.success) {
          toast.success("User deleted!");
        }
      }
    } catch (err) {
      toast.error(`Error deleting ${deleteType}`);
      console.error(err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedBlogId(null);
      setSelectedUserId(null);
      setDeleteType(null);
    }
  };

  // 👉 Filtered blogs (search + category)
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

  // 👉 Extract categories dynamically
  const categories = ["All", ...new Set(allCategories.map((c) => c?.name))];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Recent Blogs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>
          {filteredBlogs.length === 0 ? (
            <p className="text-gray-500">No Blogs found</p>
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => handleSingleBlog(blog._id)}
                  className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl flex flex-col md:flex-row gap-4 cursor-pointer"
                >
                  {/* Left: Author Info */}
                  <div className="flex-1 flex items-center gap-4">
                    {blog?.author?._id ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${blog.author._id}?t=${Date.now()}`}
                        alt={blog.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-lg font-bold">
                        {blog?.author?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{blog.title}</h3>
                      <p className="text-sm text-gray-500">
                        {blog?.author?.name}
                      </p>
                      <p className="text-sm text-gray-400">{blog.excerpt}</p>
                      <p className="text-xs text-gray-500">
                        {blog?.category?.name}
                      </p>
                    </div>
                  </div>

                  {/* Right: Cover */}
                  {blog?.coverImage && (
                    <img
                      src={blog.coverImage.url || blog.coverImage}
                      alt="cover"
                      className="w-full md:w-40 h-28 object-cover rounded-lg"
                    />
                  )}

                  {/* Delete Button */}
                  <div
                    className="flex md:flex-col justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => openDeleteModal(blog._id, e, "blog")}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        type={deleteType}
      />
    </AdminLayout>
  );
};

export default AllBlogs;
