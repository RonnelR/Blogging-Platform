import React, { useState, useEffect } from "react";
import Layout from "../Components/Layout";
import { MoreVertical } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Delete_Blog, User_Blogs } from "../Services/Api";
import ProfileModal from "../Pages/Profile";
import { useNavigate } from "react-router-dom";
import { setBlogId } from "../Redux/blogSlice.js";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal.js";
import toast from "react-hot-toast";
import AdminLayout from "../Components/AdminLayout/AdminLayout.js";

const YourBlogs = () => {
  // user details from redux
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const [profileOpen, setProfileOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null); // track which blog menu is open
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fetch all user Blogs
  const fetchUserBlogs = async (token) => {
    try {
      setLoading(true);
      const userId = user._id;
      const { data } = await User_Blogs(userId, token);

      if (data?.success && Array.isArray(data.userBlogs)) {
        setBlogs(data.userBlogs);
      } else {
        setBlogs([]); // fallback
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]); // fallback on error
    } finally {
      setLoading(false);
    }
  };

  // Navigate to single blog
  const handleSingleBlog = (id) => {
    localStorage.setItem("blogId", id);
    dispatch(setBlogId(id));
    navigate("/single-blog");
  };

  // Handle edit
  const handleEditBlog = (id, e) => {
    e.stopPropagation();
    navigate(`/edit-blog/${id}`);
  };

  // Open delete modal
  const openDeleteModal = (id, e) => {
    e.stopPropagation();
    setSelectedBlogId(id);
    setDeleteModalOpen(true);
    setOpenMenu(null); // close menu
  };

  // Confirm delete
  const confirmDelete = async () => {


    
    setBlogs((prev) => prev.filter((blog) => blog._id !== selectedBlogId));

    // TODO: Call your delete API here with selectedBlogId
    const {data} = await Delete_Blog(selectedBlogId,token)
    if (data.success) {
        toast.success('Blog deleted!')     
    }

    console.log("Deleted blog:", selectedBlogId ,);

    setDeleteModalOpen(false);
    setSelectedBlogId(null);
  };

  useEffect(() => {
    if (token && user?._id) {
      fetchUserBlogs(token);
    }
    // eslint-disable-next-line
  }, [token, user?._id]);


  const yourB = (
     <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION (Blogs) */}
        <div className="lg:col-span-2">
          <div className="text-left mb-4">
            <h2 className="text-4xl font-bold">{user?.name?.toUpperCase()}</h2>
          </div>
          <hr className="mb-4" />
          <h3 className="text-lg font-semibold mb-4">Your Blogs</h3>

          {/* Blogs List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Loading blogs...</p>
            ) : blogs.length === 0 ? (
              <p className="text-gray-500">No blogs found.</p>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => handleSingleBlog(blog?._id)}
                  className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4 relative cursor-pointer hover:shadow-lg transition"
                >
                  {/* Top Section: Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${user._id}?t=${Date.now()}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="font-medium">{user.name}</p>
                  </div>

                  {/* Blog Content (Side-by-side) */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Left: Text */}
                    <div className="flex-1">
                      <h4 className="text-left font-semibold text-lg">
                        {blog.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                        {blog.excerpt || "No description available."}
                      </p>
                    </div>

                    {/* Right: Cover Image */}
                    {blog?.coverImage?.url ? (
                      <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        className="w-28 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-28 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Bottom Right: More Options */}
                  <div className="flex justify-end relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === blog._id ? null : blog._id);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical />
                    </button>

                    {/* Dropdown */}
                    {openMenu === blog._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-10 bg-white border rounded-lg shadow-md w-32 z-10"
                      >
                        <button
                          onClick={(e) => handleEditBlog(blog._id, e)}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          ✏️ Edit Blog
                        </button>
                        <button
                          onClick={(e) => openDeleteModal(blog._id, e)}
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                        >
                          🗑️ Delete Blog
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SECTION (Profile) */}
        <div className="shadow-md rounded-2xl p-6 flex flex-col items-center">
          {user?.photo?.data ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${user._id}?t=${Date.now()}`}
              alt={user?.name}
              className="w-24 h-24 mb-4 rounded-full object-cover border-4 border-[#4ECCA3] shadow-md"
            />
          ) : (
            <div className="w-24 h-24 mb-4 rounded-full flex items-center justify-center bg-gray-300 text-2xl font-bold border-4 border-[#4ECCA3] shadow-md">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div
            onClick={() => setProfileOpen(true)}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            View Profile
          </div>

          {profileOpen && (
            <ProfileModal
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
              user={user}
            />
          )}
        </div>
      </div>

     
  )

  return (
      <>
 {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {user?.role === "admin" ? (
        <AdminLayout>{yourB}</AdminLayout>
      ) : (
        <Layout>{yourB}</Layout>
      )}
    </>
  );
};

export default YourBlogs;   
