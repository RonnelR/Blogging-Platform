//user schema
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNo:{
        type:Number,
        unique:true,
        sparse:true
    },
    photo: {
        data: Buffer,
        contentType: String
        },
    savedBlogs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
],
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{timestamps:true});

export const userModel = mongoose.model('User',userSchema)
