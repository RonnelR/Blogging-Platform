import express from 'express'
import { isAdmin, isSignInRequired } from '../Middlewares/auth.js';
import {createCategoryController, deleteCategoryController, getCategoryController} from '../Controllers/categoryController.js' 


const router = express.Router();

router.get('/categories',isSignInRequired,getCategoryController)
router.post('/create-category',isSignInRequired,isAdmin,createCategoryController)
router.delete('/delete-category/:cId',isSignInRequired,isAdmin,deleteCategoryController)


export default router