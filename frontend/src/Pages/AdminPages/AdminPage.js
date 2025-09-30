import React, { useEffect, useState } from "react";
import AdminLayout from "../../Components/AdminLayout/AdminLayout";
import { Users, FileText, Trash2, Edit } from "lucide-react";
import {
  All_Blogs,
  All_Users,
  Delete_Blog,
  Delete_User,
  Update_Role,
} from "../../Services/Api";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { setBlogId } from "../../Redux/blogSlice";

const AdminPage = () => {
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [deleteType, setDeleteType] = useState(null); // "user" or "blog"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Navigate to single blog
  const handleSingleBlog = (id) => {
    localStorage.setItem("blogId", id);
    dispatch(setBlogId(id));
    navigate("/single-blog");
  };

  // Fetch all users
  const allUsers = async () => {
    try {
      const { data } = await All_Users(token);
      if (data?.allUsers) {
        setUsers(data.allUsers);
      }
    } catch (error) {
      toast.error(`Error fetching users: ${error.message}`);
    }
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

  // ✅ FIXED useEffect
  useEffect(() => {
    if (token) {
      allUsers();
      fetchAllBlogs();
    }
    //eslint-disable-next-line
  }, [token]);

  // Toggle role (admin <-> user)
  const toggleRole = async (id, role) => {
    try {
      const changeRole = role === "admin" ? "user" : "admin";
      const { data } = await Update_Role(id, changeRole, token);

      if (data?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role: changeRole } : u
          )
        );
        toast.success(`Changed role to ${changeRole}`);
      }
    } catch (error) {
      toast.error(`Error changing role: ${error.message}`);
    }
  };

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
          setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
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

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/all-users")}
            className="p-6 bg-white dark:bg-gray-800 shadow rounded-2xl flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-2xl font-bold">{users.length}</h2>
            </div>
            <Users className="text-blue-500" size={40} />
          </div>
          <div
            onClick={() => navigate("/all-blogs")}
            className="p-6 bg-white dark:bg-gray-800 shadow rounded-2xl flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-gray-500">Total Blogs</p>
              <h2 className="text-2xl font-bold">{blogs.length}</h2>
            </div>
            <FileText className="text-green-500" size={40} />
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No Users</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {user?.photo ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${user._id}?t=${Date.now()}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-lg font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm  text-gray-500">
                        Role:<span className="font-bold"> {user.role.toUpperCase()}</span>
                      </p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRole(user._id, user.role)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <Edit size={16} /> Toggle Role
                    </button>
                    <button
                      onClick={(e) => openDeleteModal(user._id, e, "user")}
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

        {/* Recent Blogs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Blogs</h2>
          {blogs.length === 0 ? (
            <p className="text-gray-500">No Blogs</p>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => handleSingleBlog(blog._id)}
                  className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl flex flex-col md:flex-row gap-4 cursor-pointer"
                >
                  {/* Left: Author Info */}
                  <div className="flex-1 flex items-center gap-4">
                    {blog?.author?.photo ? (
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
                      <p className="text-sm text-gray-500">{blog?.author?.name}</p>
                      <p className="text-sm text-gray-400">{blog.excerpt}</p>
                    </div>
                  </div>

                  {/* Right: Cover */}
                  {blog?.coverImage && (
                    <img
                      src={blog.coverImage.url ? blog.coverImage.url : blog.coverImage}
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

export default AdminPage;
