import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { All_Categories, New_Blog } from "../Services/Api";
import toast from "react-hot-toast";
import AdminLayout from "../Components/AdminLayout/AdminLayout";

const NewBlog = () => {
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("select a category");

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  // add topic
  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput)) {
      setTopics([...topics, topicInput]);
      setTopicInput("");
    }
  };

  // get categories
  const fetchCategories = async () => {
    try {
      const { data } = await All_Categories(token);
      if (data) {
        setAllCategories(data?.categories);
      } else {
        toast.error("No categories available");
      }
    } catch (err) {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    //eslint-disable-next-line
  }, []);

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cover) {
      toast.error("Please select a cover image");
      return;
    }
    if (excerpt.length > 200) {
      toast.error("Excerpt cannot be more than 200 characters");
      return;
    }
    if (!selectedCategory || selectedCategory === "select a category") {
      toast.error("Please select a valid category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("author", user?._id);
    formData.append("category", selectedCategory); // ✅ category as _id

    topics.forEach((topic) => {
      formData.append("tags[]", topic);
    });

    formData.append("coverImage", cover);

    try {
      setLoading(true);
      const { data } = await New_Blog(formData, token);
      if (data) {
        toast.success("Blog created successfully!");
        setTitle("");
        setExcerpt("");
        setContent("");
        setTopics([]);
        setCover(null);
        setSelectedCategory("select a category");
      }
    } catch (error) {
      console.error(
        "Error creating blog:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  // Common blog form content
  const BlogForm = (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cover Image */}
        <div>
          <label className="block font-medium mb-2">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
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
          <label className="block font-medium mb-2">
            Excerpt (max 200 characters)
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={200}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Short description about your blog..."
            rows={3}
            required
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            {excerpt.length}/200 characters
          </p>
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

        {/* Publish Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {user?.role === "admin" ? (
        <AdminLayout>{BlogForm}</AdminLayout>
      ) : (
        <Layout>{BlogForm}</Layout>
      )}
    </>
  );
};

export default NewBlog;
