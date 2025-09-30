// SingleBlog.js
import React, { useEffect, useState, useRef } from "react";
import Layout from "../Components/Layout";
import {
  Heart,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  MoreVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  Single_Blog,
  Like_Blog,
  Unlike_Blog,
  Add_Comment,
  Delete_Comment,
  Update_Comment,
  Save_Blog,
  Unsave_Blog,
  Saved_Blogs,
} from "../Services/Api";
import toast from "react-hot-toast";
import AdminLayout from "../Components/AdminLayout/AdminLayout";

const SingleBlog = () => {
  const blogId = useSelector((state) => state.blogId.blogId);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [savedBlogs, setSavedBlogs] = useState([]);

  const editInputRef = useRef(null);
  const commentsRef = useRef(null);
  const commentInputRef = useRef(null);

  const userId = user?._id || user?.id;

  const normalizeBlogFromResponse = (data) =>
    data?.singleBlog || data?.blog || data || null;

  // Fetch blog details
  const fetchBlogDetails = async () => {
    if (!blogId) return;
    setLoading(true);
    try {
      const { data } = await Single_Blog(blogId, token);
      const single = normalizeBlogFromResponse(data);
      setBlog(single);

      if (single?.likes && userId) {
        const isLiked =
          Array.isArray(single.likes) &&
          single.likes.some((l) =>
            typeof l === "string" ? l === userId : l._id === userId
          );
        setLiked(Boolean(isLiked));
      } else {
        setLiked(false);
      }
    } catch (err) {
      console.error("fetch blog error:", err);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved blogs
  const fetchSavedBlogs = async () => {
    try {
      const { data } = await Saved_Blogs(token);
      if (data?.success) {
        setSavedBlogs(data.savedBlogs.map((b) => b?._id));
      }
    } catch (err) {
      console.error("Error fetching saved blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    fetchSavedBlogs();
    // eslint-disable-next-line
  }, [blogId, token]);

  // autofocus on edit start
  useEffect(() => {
    if (editingCommentId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCommentId]);

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

  // like toggle
  const handleToggleLike = async (e) => {
    e?.stopPropagation();
    if (!token) {
      toast.error("Please log in to like posts");
      return;
    }
    if (!blog) return;

    const currentIsLiked = liked;
    setBlog((prev) => {
      const prevLikes = Array.isArray(prev.likes) ? [...prev.likes] : [];
      let newLikes;
      if (currentIsLiked) {
        newLikes = prevLikes.filter((l) =>
          typeof l === "string" ? l !== userId : l._id !== userId
        );
      } else {
        newLikes = [...prevLikes, userId];
      }
      return { ...prev, likes: newLikes };
    });
    setLiked(!currentIsLiked);

    try {
      if (currentIsLiked) {
        await Unlike_Blog(blogId, token);
      } else {
        await Like_Blog(blogId, token);
      }
    } catch (err) {
      console.error("like toggle API error:", err.message);
      toast.error("Could not update like. Refreshing...");
      fetchBlogDetails();
    }
  };

  // add comment
  const handleAddComment = async (e) => {
    e?.preventDefault();
    if (!token) {
      toast.error("Please log in to comment");
      return;
    }
    const text = commentText?.trim();
    if (!text) return;

    setPosting(true);
    const optimisticComment = {
      _id: `tmp-${Date.now()}`,
      user: { _id: userId, name: user?.name || "You", photo: user?.photo || null },
      text,
      createdAt: new Date().toISOString(),
    };

    setBlog((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), optimisticComment],
    }));
    setCommentText("");

    try {
      const { data } = await Add_Comment(blogId, text, token);
      if (data?.comments) {
        setBlog((prev) => ({ ...prev, comments: data.comments }));
      } else if (data?.success && data?.comment) {
        setBlog((prev) => ({
          ...prev,
          comments: [
            ...(prev.comments || []).filter((c) => !String(c._id).startsWith("tmp-")),
            data.comment,
          ],
        }));
      }
      toast.success("Comment posted");
    } catch (err) {
      console.error("add comment error:", err);
      toast.error("Failed to post comment");
      fetchBlogDetails();
    } finally {
      setPosting(false);
    }
  };

  // delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const { data } = await Delete_Comment(blogId, commentId, token);
      if (data?.comments) {
        setBlog((prev) => ({ ...prev, comments: data.comments }));
      } else {
        setBlog((prev) => ({
          ...prev,
          comments: prev.comments?.filter((c) => c._id !== commentId),
        }));
      }
      toast.success("Comment deleted");
    } catch (err) {
      console.error("delete comment error:", err);
      toast.error("Could not delete comment");
    }
  };

  // start editing
  const handleEditStart = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
    setMenuOpenId(null);
  };

  // save edit
  const handleEditSave = async (commentId) => {
    const newText = editText.trim();
    if (!newText) return;

    try {
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, text: newText } : c
        ),
      }));

      setEditingCommentId(null);
      setEditText("");

      const { data } = await Update_Comment(blogId, commentId, newText, token);

      if (data?.comments) {
        setBlog((prev) => ({ ...prev, comments: data.comments }));
      } else if (data?.comment) {
        setBlog((prev) => ({
          ...prev,
          comments: prev.comments.map((c) =>
            c._id === commentId ? data.comment : c
          ),
        }));
      }

      toast.success("Comment updated");
    } catch (err) {
      console.error("edit comment error:", err.message);
      toast.error("Failed to update comment");
      fetchBlogDetails();
    }
  };

  // scroll to comments
  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 500);
  };

  const likesCount = Array.isArray(blog?.likes)
    ? blog.likes.length
    : blog?.likes || 0;
  const commentsList = Array.isArray(blog?.comments) ? blog.comments : [];

  if (loading || !blog) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">Loading...</div>
      </Layout>
    );
  }

  const single = (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
        {blog?.title}
      </h1>

      {/* Excerpt */}
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {blog?.excerpt}
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          {blog?.author?._id ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/api/auth/user-photo/${blog?.author?._id}?t=${Date.now()}`}
              alt={blog?.author?.name || "Unknown"}
              className="w-10 h-10 border-2 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold">
              {blog?.author?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="font-medium text-gray-800 dark:text-gray-100">
            {blog?.author?.name || "Unknown Author"}
          </span>
        </div>
  
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            <button onClick={handleToggleLike} className="flex items-center gap-1">
              <Heart
                className={`w-5 h-5 cursor-pointer ${
                  liked ? "text-red-500" : "hover:text-red-500"
                }`}
                fill={liked ? "currentColor" : "none"}
              />
              <span>{likesCount}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle
              className="w-5 h-5 cursor-pointer hover:text-blue-500"
              onClick={scrollToComments}
            />
            <span>{commentsList.length}</span>
          </div>
        </div>
        {savedBlogs.includes(blog?._id) ? (
          <BookmarkCheck
            onClick={(e) => handleToggleSave(e, blog?._id)}
            className="w-5 h-5 cursor-pointer text-green-600"
            fill="currentColor"
          />
        ) : (
          <Bookmark
            onClick={(e) => handleToggleSave(e, blog?._id)}
            className="w-5 h-5 cursor-pointer hover:text-green-500"
          />
        )}
      </div>

      {/* Cover */}
      {blog?.coverImage?.url && (
        <img
          src={blog.coverImage.url}
          alt={blog?.title || "Blog Cover"}
          className="w-full h-80 object-cover rounded-xl shadow-md"
        />
      )}

      {/* Content */}
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: blog?.content }}
      />

      {/* Comments */}
      <div ref={commentsRef} className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Comments ({commentsList.length})
        </h2>

        {/* New comment */}
        <form onSubmit={handleAddComment}>
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            rows="3"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setCommentText("")}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={posting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>

        {/* Existing comments */}
        <div className="mt-6 space-y-4">
          {commentsList.length === 0 ? (
            <p className="text-gray-500">No comments yet — be the first!</p>
          ) : (
            commentsList.map((c) => {
              const commenterName = c.user?.name || "User";
              const commenterId = c.user?._id || c.user;
              const isOwner = String(commenterId) === String(userId);
              return (
                <div key={c._id} className="flex gap-3 items-start">
                  <img
                    src={
                      c.user?.photo?.url ||
                      `${process.env.REACT_APP_API_URL}/api/auth/user-photo/${commenterId}?t=${Date.now()}`
                    }
                    alt={commenterName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="w-full">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {commenterName}
                        </p>
                        {editingCommentId === c._id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              ref={editInputRef}
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSave(c._id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditText("");
                                }}
                                className="px-3 py-1 border rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {c.text}
                          </p>
                        )}
                      </div>

                      {isOwner && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuOpenId(menuOpenId === c._id ? null : c._id)
                            }
                            className="p-1"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>
                          {menuOpenId === c._id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border rounded shadow-md z-10">
                              <button
                                onClick={() => handleEditStart(c)}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {user?.role === "admin" ? (
        <AdminLayout>{single}</AdminLayout>
      ) : (
        <Layout>{single}</Layout>
      )}
    </>
  );
};  

export default SingleBlog;
