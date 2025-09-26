import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
         url: {
              type: String, // cloudinary secure_url
              required: true,
              },
         public_id: {
                      type: String, // Cloudinary public_id
                      required: true,
                    },
     
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true
      },
    
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],  
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
