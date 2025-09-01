import express from "express";
import { allUsersController, loginController, registerController, updateProfileController, updateRoleController, userPhotoController } from "../Controllers/authControllers.js";
import { isAdmin, isSignInRequired } from "../Middlewares/auth.js";
import formidable from 'express-formidable'; 


const router = express.Router()

// login
router.post('/login',loginController)

// register
router.post('/register',registerController)

//update profile
router.put('/update-profile', isSignInRequired,formidable(),updateProfileController)

//get photo 
router.get('/user-photo',userPhotoController)

//get all users
router.get('/all-users',isSignInRequired,isAdmin,allUsersController)

//delete user
router.delete('/delete-user',isSignInRequired,isAdmin,allUsersController)
 
//update role
router.patch('/update-role',isSignInRequired,isAdmin,updateRoleController)




export default router;