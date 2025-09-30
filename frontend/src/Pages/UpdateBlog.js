import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Single_Blog, Update_Blog, All_Categories } from "../Services/Api";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const UpdateBlog = () => {
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const { blogId } = useParams();

  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [author, setAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("select a category");
  const [allCategories, setAllCategories] = useState([]);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch blog details
  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const { data } = await Single_Blog(blogId, token);
      if (data?.success) {
        const b = data.singleBlog;
        setBlog(b);

        // ✅ pre-fill states
        setTitle(b.title || "");
        setExcerpt(b.excerpt || "");
        setContent(b.content || "");
        setAuthor(b.author._id);
        setTopics(b.tags || []);
        setSelectedCategory(b.category?._id || "select a category");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await All_Categories(token);
      if (data) {
        setAllCategories(data?.categories);
      }
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    if (blogId) {
      fetchBlogDetails();
      fetchCategories();
    }
    // eslint-disable-next-line
  }, [blogId]);

  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput)) {
      setTopics([...topics, topicInput]);
      setTopicInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || selectedCategory === "select a category") {
      toast.error("Please select a valid category");
      return;
    }

    try {
      const formData = new FormData();
      if (cover) formData.append("coverImage", cover); // only append if new cover is selected
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("author", author);
      formData.append("category", selectedCategory); // ✅ category instead of categories

      topics.forEach((topic) => {
        formData.append("tags[]", topic);
      });

      const { data } = await Update_Blog(formData, blogId, token);

      if (data?.success) {
        toast.success("Blog Updated!");
        navigate("/your-blogs");
      } else {
        toast.error(data?.message || "Error in updating blog");
      }
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Edit Blog
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading blog...</p>
        ) : !blog ? (
          <p className="text-gray-500">Blog not found.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cover Image */}
            <div>
              {blog?.coverImage?.url && (
                preview ? (
                  <img
                    src={preview}
                    alt="New Cover"
                    className="mt-2 w-40 h-28 object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={blog.coverImage.url}
                    alt="Current Cover"
                    className="mt-2 w-40 h-28 object-cover rounded-lg"
                  />
                )
              )}

              <label className="block font-medium mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setCover(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block font-medium mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Short description about your blog..."
                rows={3}
                required
              ></textarea>
            </div>

            {/* Content */}
            <div>
              <label className="block font-medium mb-2">Content</label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="bg-white dark:bg-gray-800 rounded-lg"
                placeholder="Write your blog content here..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="select a category">select a category</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="block font-medium mb-2">Topics</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Add a topic"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Update Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default UpdateBlog;
