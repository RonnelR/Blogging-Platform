import bcrypt from 'bcryptjs'
import { userModel } from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs'
import nodemailer from "nodemailer";


//-------------------register controller---------------------

export const registerController = async (req,res)=>{

    const {name,email,password,role} = req.body;

    //validation cheking
    if(!name){
        return res.status(401).json({
            success:false,
            message:"name is required!"
        })
    }

    if(!email){
        return res.status(401).json({
            success:false,
            message:"email is required!"
        })
    }

    if(!password){
        return res.status(401).json({
            success:false, 
            message:"password is required!"
        }) 
    }

    try {
        
    //checking if already registered
    const alreadyUser = await userModel.findOne({email})
    if (alreadyUser) {
        return  res.status(201).json({
            success:true,
            message:"Already a user, please login!"
        })
    }

    //hashing password using bcryptjs
    const hashPassword = await bcrypt.hash(password,10);

    //creating & saving new-user in database
    const newUser = await userModel({name,email,password:hashPassword,role})
    newUser.save()
        
        res.status(200).json({
            newUser,
            success:true,
            message:"New user created!"
        })
    } catch (error) {
        res.status(400).json({
            error,
            success:false,
            message:"Error in register!!"
        })
    }

}


//-------------Login Controller----------------------------

export const loginController = async (req,res)=>{
    
  const {email,password} = req.body;

    //validation cheking
    if(!email){
        return res.status(401).json({
            success:false,
            message:"email is required!"
        })
    }

    if(!password){
        return res.status(401).json({
            success:false,
            message:"password is required!"
        })       
    }

try {

//checking for a regisetered user
const registeredUser = await userModel.findOne({email})
if(!registeredUser){
    return res.status(401).json({
            success:false,
            message:"Not a regiseted user, please register!"
        }) 
}

//comparing password
const comparePassword = await bcrypt.compare(password,registeredUser.password)
if(!comparePassword){
    return res.status(401).json({
            success:false,
            message:"password not matching!"
        }) 
}

//token creation
const token = jwt.sign({id:registeredUser._id,role:registeredUser.role},process.env.JWT_SECRET,{expiresIn:'7d'})

res.status(200).json({
    success:true,
    message:"Login successful!",
    user:{
            phoneNo : registeredUser.phoneNo,
            _id: registeredUser._id,
            name: registeredUser.name,
            email: registeredUser.email,
            role: registeredUser.role,
            ...(registeredUser.photo && registeredUser.photo.data 
        ? { photo: registeredUser.photo } 
        : {}), // only add photo if it exists
    },token
  
})

} catch (error) {
     res.status(400).json({
            error,
            success:false,
            message:"Error in login!!"
        })
}

}


//--------------------forgot password-----------------------------------


//  Send Reset Link
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    //validation
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await userModel.findOne({ email });
    //check email is registered
    if (!user) return res.status(404).json({ success: false, message: "User not found,Please register" });

    // Create reset token (expires in 15m)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send mail
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can use others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Italics Blogging Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Italics.",
      html: `<p>You requested a password reset</p>
             <p>Click here to reset: <a href="${resetLink}">${resetLink}</a></p>
             <p>This link is valid for 15 minutes.</p>`,
    });

    res.json({ success: true, message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//----------------------reset link for password change---------------

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    //validation
    if (!password) return res.status(400).json({ success: false, message: "Password is required" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    //update usermodel with new password
    await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ success: true, message: "Password has been reset successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Invalid or expired token" });
  }
};


//-------------Update Profile Controller----------------------------
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phoneNo } = req.fields;
    const { photo } = req.files;
    const { id } = req.params;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required!" });

      case phoneNo && phoneNo.length > 10:
        return res
          .status(400)
          .send({ error: "Phone number must be max 10 digits" });

      case photo && photo.size > 1000000:
        return res
          .status(400)
          .send({ error: "Photo size should be below 1 MB" });
    }

    // Build update data
    const updateData = {};

    if (name) updateData.name = name;

    // only update phoneNo if provided
    if (phoneNo !== undefined && phoneNo !== "") {
      updateData.phoneNo = phoneNo;
    }

    // Handle password (only if provided)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Find and update user
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // If photo is uploaded
    if (photo) {
      updatedUser.photo.data = fs.readFileSync(photo.path);
      updatedUser.photo.contentType = photo.type;
      await updatedUser.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in updateProfileController:", error);
    res.status(500).json({
      success: false,
      message: "Error in updating profile",
      error: error.message,
    });
  }
};

//-------------get photo Controller----------------------------

export const userPhotoController = async (req,res) =>{
    try {

        const user = await userModel.findById(req.params.id).select("photo")
        if(user?.photo.data){
          res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    } else {
      res.status(404).send({ message: "Photo not found" });
    }

    } catch (error) {
        res.status(400).json({
            success:false,
            message:'Error in getting user photo'
        })
    }
}

//-------------get all users Controller----------------------------


export const allUsersController = async (req,res) =>{
try {
  
    const allUsers = await userModel.find({})

    if (!allUsers) {
        res.json({message:"no user to show!"})
    }else{
        res.status(200).json({
            success:true,
            message:"All users",
            noOfUsers:allUsers.length,
            allUsers
        })
    }

} catch (error) {
    res.status(400).json({
            success:false,
            message:"Error in all users!",
            error
        })
}
}


//-------------delete user Controller----------------------------
export const deleteUserController = async ( req,res )=>{
     try {
       const deleteUser = await userModel.findByIdAndDelete(req.params.userId)
       if(!deleteUser){
          res.status(400).json({
         success:false,
         message:"Error in deleting user!",
       })
       }else{
    res.status(200).json({
         success:true,
         message:"User is deleted!",
       })
       }
       
     } catch (error) {
       res.status(400).json({
         success:false,
         message:"Error in deleting file",
         error
   
       })
     }
}


//-------------update user role Controller----------------------------
export const updateRoleController = async (req, res) => {
  try {
    const id = req.params.userId;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role required",
      });
    }

    // 🔎 Check if user exists first
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔎 Update role safely  
    user.role = role;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Role changed successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating role:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error while updating role",
      error: error.message,
    });
  }
};


//--------------------------------save blog---------------------------------------
export const saveBlogController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id // from auth middleware
    if (!userId) {
      return res.status(400).json({ success: false, message: "userid is not getting" });
    }

    const { blogId } = req.params;

    const user = await userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { savedBlogs: blogId } },
        { new: true }
      )
      .populate("savedBlogs");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, savedBlogs: user.savedBlogs });
  } catch (error) {
    console.error("Save Blog Error:", error);
    res.status(500).json({ success: false, message: "Error saving blog", error: error.message });
  }
};


//-----------------------------------unsave blog----------------------------
export const unsaveBlogController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id
    const { blogId } = req.params;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $pull: { savedBlogs: blogId } },
      { new: true }
    ).populate("savedBlogs");

    res.json({ success: true, savedBlogs: user.savedBlogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error unsaving blog", error });
  }
};



//-------------------------get saved blogs----------------------------
export const getSavedBlogsController = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const user = await userModel.findById(userId).populate({
      path: "savedBlogs",
      populate: { path: "author", select: "name _id" }
    });

    res.json({ success: true, savedBlogs: user.savedBlogs , countOfSavedBlogs: user.savedBlogs.length});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching saved blogs", error });
  }
};
