import express from "express";
import { allUsersController, deleteUserController, forgotPasswordController, getSavedBlogsController, loginController, registerController, resetPasswordController, saveBlogController, unsaveBlogController, updateProfileController, updateRoleController, userPhotoController } from "../Controllers/authControllers.js";
import { isAdmin, isSignInRequired } from "../Middlewares/auth.js";
import formidable from 'express-formidable'; 

//router config
const router = express.Router()

// login
router.post('/login',loginController)

// register
router.post('/register',registerController)

//update profile
router.put('/update-profile/:id', isSignInRequired,formidable(),updateProfileController)

//get photo 
router.get('/user-photo/:id',userPhotoController)

//get all users
router.get('/all-users',isSignInRequired,isAdmin,allUsersController)

//delete user
router.delete('/delete-user/:userId',isSignInRequired,isAdmin,deleteUserController)
 
//update role
router.patch('/update-role/:userId',isSignInRequired,isAdmin,updateRoleController)




//save blogs route
router.patch('/save-blog/:blogId',isSignInRequired,saveBlogController)
//remove blogs route
router.delete('/save-blog/:blogId',isSignInRequired,unsaveBlogController)
//view saved blogs route
router.get('/saved-blogs',isSignInRequired,getSavedBlogsController)


//forgot password & reset password
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);




//protected route
router.get('/user-auth',isSignInRequired,(req,res)=>{res.status(200).json({ok:true})})
//protected admin routes
router.get('/admin-auth',isSignInRequired,isAdmin, (req,res)=>{res.status(200).json({ok:true})})




export default router;