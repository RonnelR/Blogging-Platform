import React, { useState, useEffect } from "react";
import AdminLayout from "../../Components/AdminLayout/AdminLayout";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Create_Category, All_Categories, Delete_Category } from "../../Services/Api"; // 👈 your API services
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "../../Components/DeleteConfirmationModal";

const CategoryPage = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
      const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    
  

  const token = useSelector((state)=>state.user.token)

//get categories
  const fetchCategories = async (token) => {
    try {
      const {data} = await All_Categories(token);
        

      if (data) {
        setCategories(data?.categories);

      }else{
        toast.error("no categories available")
      }
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  
  // Fetch categories on load
  useEffect(() => {
    fetchCategories(token);
   
  }, [token]);

  // Handle category creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) return toast.error("Category name is required");

    try {
 
      const res = await Create_Category({ name },token);

      if (res?.data?.success) {
        toast.success("Category created ✅");
        setName("");
        fetchCategories(token);
      } else {
        toast.error(res.message || "Failed to create");
      }
    } catch (err) {
      toast.error("Error creating category");
    }
  };

   // Open delete modal
  const openDeleteModal = (id,e) => {
    e.stopPropagation();
    setSelectedCategoryId(id);
    setDeleteModalOpen(true);
  };


  // Handle category delete
  const handleDelete = async () => {
    try {
      const res = await Delete_Category(selectedCategoryId,token);
      
      if (res?.data?.success) {
        toast.success("Category deleted 🗑️");
        fetchCategories(token);
      }
    } catch (err) {
      toast.error("Error deleting category");
    }finally {
      setDeleteModalOpen(false);
      setSelectedCategoryId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

        {/* Create category form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 mb-8"
        >
          <input
            type="text"
            placeholder="Enter new category..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add
          </button>
        </form>

        {/* Category list */}
        <div className="bg-white shadow rounded-lg divide-y">
          {categories?.length > 0 ? (
            categories?.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
              >
                <span className="font-medium">{cat.name}</span>
                <button
                onClick={(e) => openDeleteModal(cat?._id, e)}
                 
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center p-4">
              No categories created yet.
            </p>
          )}
        </div>
      </div>


       {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDelete}
              type="Category"
            />


    </AdminLayout>
  );
};

export default CategoryPage;
