import {createSlice,}  from '@reduxjs/toolkit'

//initial state
const initialState = {
    blogId:''
};


// blogSlice
const blogSlice = createSlice({
    name:'blogId',
    initialState,
    reducers:{
        setBlogId : (state,action)=>{
            state.blogId = action.payload;
        } ,
        clearBlogId : (state)=>{
             state.blogId =''
        }
    }
});

export const {setBlogId , clearBlogId} = blogSlice.actions
export default blogSlice.reducer;