import { configureStore } from '@reduxjs/toolkit'
import userReducer from './UserSlice'
import blogReducer from './blogSlice'

// get data from localStorage
const authData = localStorage.getItem('auth');
const blogId = localStorage.getItem('blog');

// parse data from localStorage
const parsedAuth = authData ? JSON.parse(authData) : { user: null, token: '' }
const parsedBlogId = blogId ? JSON.parse(blogId) : { blogId: '' }

// preloaded redux state
const preloadedState = {
  user: {
    user: parsedAuth.user,
    token: parsedAuth.token,
  },
  blogId: {
    blogId: parsedBlogId.blogId,
  },
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    blogId: blogReducer,   // 👈 add blog reducer here
  },
  preloadedState,
})
