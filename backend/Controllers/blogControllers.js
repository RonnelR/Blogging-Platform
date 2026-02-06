import blogModel from "../Models/blogModel.js";
import cloudinary from "../Cofig/cloudinary.js"
import slugify from "slugify";
import fs from "fs";

// -------------------create blog------------------

export const createBlogController = async (req, res) => {
  try {
    const { title, excerpt, content, author, category, tags } = req.body;
    const file = req.file; //multerr gives this

    // validation
    if (!title) return res.status(400).json({ message: "Title is required!" });
    if (!excerpt) return res.status(400).json({ message: "Excerpt is required!" });
    if (!content) return res.status(400).json({ message: "Content is required!" });
    if (!author) return res.status(400).json({ message: "Author is required!" });
    if (!category) return res.status(400).json({ message: "Category is required!" });
    if (!tags) return res.status(400).json({ message: "Tags are required!" });
    if (!file) return res.status(400).json({ message: "Cover image is required!" });

    // Generate slug from title
    let slug = slugify(title, { lower: true, strict: true });
    const existingBlog = await blogModel.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    // parse tags & categories if JSON string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    }
    if(!Array.isArray(tags)){
      tags= [tags]
    }

    // Upload cover image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "blogs",
      resource_type: "image",
    });

    // ✅ Delete local file after uploading
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    // Save blog
    const blog = new blogModel({
      title,
      slug,
      excerpt,
      content,
      author,
      category,
      tags,
      coverImage: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog,
    });
  } catch (error) {
    console.error("Error in creating blog:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error while creating blog",
      error: error.message,
    });
  }
};

//----------------edit blog controller---------------------------------
export const editBlogController = async (req, res) => {
  try {
    const { blogId } = req.params;
    let { title, excerpt, content, author, category, tags } = req.body;
    const file = req.file;

    // validation
    if (!title) return res.status(400).json({ message: "Title is required!" });
    if (!excerpt) return res.status(400).json({ message: "Excerpt is required!" });
    if (!content) return res.status(400).json({ message: "Content is required!" });
    if (!author) return res.status(400).json({ message: "Author is required!" });
    if (!tags) return res.status(400).json({ message: "tags is required!" });
    if (!category) return res.status(400).json({ message: "category is required!" });

    // parse tags & categories if JSON string
    if (typeof tags === 'string') {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    }
    if(!Array.isArray(tags)){
      tags= [tags]
    }

    // if (category) {
    //   try {
    //     category = JSON.parse(category);
    //   } catch {
    //     category = [category];
    //   }
    // }

    const blog = await blogModel.findById(blogId);
    if (!blog) return res.status(401).json({ success: false, message: "Blog not found" });

    let slug = slugify(title, { lower: true, strict: true });
    const existingBlog = await blogModel.findOne({ slug, _id: { $ne: blogId } });
    if (existingBlog) slug = `${slug}-${Date.now()}`;

    let coverImage = blog.coverImage;

    if (file) {
      if (coverImage?.public_id) {
        await cloudinary.uploader.destroy(coverImage.public_id);
      }
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "blogs",
        resource_type: "image",
      });
      fs.unlink(file.path, (err) => err && console.error("File delete error:", err));
      coverImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // update
    blog.title = title;
    blog.slug = slug;
    blog.excerpt = excerpt;
    blog.content = content;
    blog.author = author;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.coverImage = coverImage;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully!",
      blog,
    });
  } catch (error) {
    console.error("Error in editing blog:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error while editing blog",
      error: error.message,
    });
  }
};

// ---------------------- delete blog controller ----------------------

export const deleteBlogController = async (req, res) => {
  try {
    const {blogId} = req.params; // blogId from route

    // Find blog
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // If blog has a cover image → delete from Cloudinary
    if (blog.coverImage?.public_id) {
      await cloudinary.uploader.destroy(blog.coverImage.public_id);
    }

    // Delete blog from DB
    await blogModel.findByIdAndDelete(blogId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleting blog:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting blog",
      error: error.message,
    });
  }
};


//---------------------------------all blogs controller----------------------------
export const allBlogsController = async (req,res)=>{
    try {
     const allBlogs = await blogModel
  .find({})
  .populate("author", "name _id photo")
  .populate("category", "name");

      if(allBlogs){
       return  res.status(200).json({
      success: true,
      message: "All Blogs",
      allBlogs,
    });
      }
      else{
        res.status(400).json({
          success:false,
          message: "Error in getting all blogs"
        })
      }
    } catch (error) {
      res.status(500).json({
        success:false,
        message: "Server Error while getting blogs",
        error: error.message,
      })
    }
}


//----------------------------- get userBlogs controller--------------------------
export const userBlogsController = async (req, res) => {
  try {
    const { userId } = req.params;

    // find all blogs where author matches userId
    const userBlogs = await blogModel.find({ author: userId });

    if (userBlogs && userBlogs.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User Blogs fetched successfully",
        userBlogs,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No blogs found for this user",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error while getting blogs",
      error: error.message,
    });
  }
};



//-------------------------get sigle blog details-----------------
export const singleBlogController = async (req,res)=>{
  try {
   
    const singleBlog = await blogModel.findById(req.params.id).populate("author","name _id") 
    if(singleBlog){
      res.status(200).json({
        success:true,
        message:"single blog",
        singleBlog
      })
    }else{
        res.status(400).json({
        success:false,
        message:"error in getting single blog",
      })
    }
  } catch (error) {
     res.status(500).json({
        success:false,
        message: "Server Error while getting single blog",
        error: error.message,
      })
  }
}


//--------------------------- Like Blog ------------------------
export const likeBlogController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const userId = req.user.id.toString();
    blog.likes = blog.likes || [];
    if (!blog.likes.includes(userId)) blog.likes.push(userId);

    await blog.save();
    res.json({ success: true, likes: blog.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//---------------------------- Unlike Blog -----------------------------
export const unlikeBlogController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const userId = req.user.id.toString();
    blog.likes = blog.likes || [];
    blog.likes = blog.likes.filter((id) => id.toString() !== userId);

    await blog.save();
    res.status(200).json({ success: true, likes: blog.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//----------------- Add Comment -----------------
export const addCommentController = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.user._id || req.user.id;
    const { text } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

    const blog = await blogModel.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    const comment = { user: userId, text };
    blog.comments.push(comment);
    await blog.save(); 

    // return populated comments for frontend
    await blog.populate("comments.user", "name photo");

    res.status(200).json({
      success: true,
      message: "Comment added",
      comments: blog.comments,
    });
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


//----------------- Delete Comment -----------------
export const deleteCommentController = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user._id || req.user.id;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // only comment owner can delete
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
    }

    // comment remove
    blog.comments.pull(commentId);
    await blog.save();

    res.json({
      success: true,
      message: "Comment deleted",
      comments: blog.comments,
    });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



////----------------- Edit Comment -----------------
export const editCommentController = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { text } = req.body; // new text from frontend
    const userId = req.user._id || req.user.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // only comment owner can edit
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this comment" });
    }

    // update text
    comment.text = text;
    await blog.save();

    res.json({
      success: true,
      message: "Comment updated",
      comment,
      comments: blog.comments,
    });
  } catch (err) {
    console.error("editComment error:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


