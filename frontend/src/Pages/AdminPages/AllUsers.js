import React, { useEffect, useState } from "react";
import AdminLayout from "../../Components/AdminLayout/AdminLayout";
import { Trash2, Edit, Search } from "lucide-react";
import { All_Users, Delete_User, Update_Role } from "../../Services/Api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

const AllUsers = () => {
  const token = useSelector((state) => state.user.token);

  const [users, setUsers] = useState([]);
  const [deleteType, setDeleteType] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  useEffect(() => {
    allUsers(token);
    //eslint-disable-next-line
  }, []);

  // Toggle role
  const toggleRole = async (id, role) => {
    try {
      const changeRole = role === "admin" ? "user" : "admin";
      const { data } = await Update_Role(id, changeRole, token);

      if (data?.success && data?.user) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: changeRole } : u))
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
    setSelectedUserId(id);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (deleteType === "user" && selectedUserId) {
        const { data } = await Delete_User(selectedUserId, token);
        if (data?.success) {
          toast.success("User deleted!");
          setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
        }
      }
    } catch (err) {
      toast.error("Error deleting " + deleteType);
      console.error(err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedUserId(null);
      setDeleteType(null);
    }
  };

  // 👉 Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u?.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || u.role === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 👉 Extract filterRole dynamically
  const filterRole = ["All", ...new Set(users.map((b) => b?.role))];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Search + Role Filter */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 w-full sm:w-1/2">
            <Search className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg text-sm dark:bg-gray-800 dark:text-white w-full sm:w-auto"
          >
            {filterRole.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Users</h2>
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500">No Users</p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* Left: User Info */}
                  <div className="flex items-center gap-4">
                    {user?.photo?.data ? (
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
                      <p className="text-sm text-gray-500">
                        Role:{" "}
                        <span className="font-bold">
                          {user.role.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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

export default AllUsers;
