import express from 'express';
import { isSignInRequired } from '../Middlewares/auth.js';
import { addCommentController, allBlogsController, createBlogController, deleteBlogController, deleteCommentController, editBlogController, editCommentController, likeBlogController, singleBlogController, unlikeBlogController, userBlogsController } from '../Controllers/blogControllers.js';
import upload from '../Middlewares/multer.js';
import { isDataView } from 'util/types';


const router = express.Router();


//post route for creating blogs
router.post('/create-blog',isSignInRequired,upload.single("coverImage") ,createBlogController);

//post route for editing blog
router.post('/edit-blog/:blogId',isSignInRequired,upload.single("coverImage"),editBlogController)

//delete route for delete blog
router.delete('/delete-blog/:blogId',isSignInRequired,deleteBlogController)

//get route for displaying blogs
router.get('/all-blogs',isSignInRequired,allBlogsController)

//get route for user all blogs
router.get('/user-blogs/:userId',isSignInRequired,userBlogsController)

//get single blog details
router.get('/single-blog/:id',isSignInRequired,singleBlogController)

// like/unlike
router.patch("/like/:blogId", isSignInRequired, likeBlogController);
router.patch("/unlike/:blogId", isSignInRequired, unlikeBlogController);


// comments
router.post("/comment/:blogId", isSignInRequired, addCommentController);
router.delete("/comment/:blogId/:commentId", isSignInRequired, deleteCommentController);
router.put('/:blogId/comments/:commentId',isSignInRequired,editCommentController)  

export default router;