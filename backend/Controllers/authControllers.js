import bcrypt from 'bcryptjs'
import { userModel } from '../Models/userModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs'


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
        return res.status(400).send({ error: "Phone number must be max 10 digits" });

      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo size should be below 1 MB" });
    }

    // Build update data
    const updateData = { ...req.fields };

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
      updatedUser.photo.contentType = photo.type
      await updatedUser.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      updatedUser
    });
  } catch (error) {
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
    // const allUsers = await userModel.find({ role: "user" }).select("-photo");
    const allUsers = await userModel.find({}).select("-photo");

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
       const deleteUser = await userModel.findByIdAndDelete(req.params.id)
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
    const id = req.params.id;
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
