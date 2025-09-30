import axios from 'axios';

//base url
const API = axios.create({ baseURL : process.env.REACT_APP_API_URL })

//api for register
export const register = (data) => API.post('/api/auth/register',data);
//api for login
export const login = (data) => API.post('/api/auth/login',data);


//api for protected routes
export const Protected_Route = (config) => API.get('/api/auth/user-auth', config);
//api for admin Protected routes
export const AdminProtected_Route = (config) => API.get('/api/auth/admin-auth', config);

//api for updating profile
export const Update_profile = (data, id, token) => {
  return API.put(`/api/auth/update-profile/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // important for FormData
    },
  });
};

//api for delete users
export const Delete_User = (userId,token)=>{
  return API.delete(`/api/auth/delete-user/${userId}`,{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}

//api for update user role
export const Update_Role = (userId,role,token)=>{
  return API.patch(`/api/auth/update-role/${userId}`,{role},{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
}

//api for get all users
export const All_Users = (token)=>{
  return API.get('/api/auth/all-users',{

    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}


// --------------------------------blog api's-------------------------------------

// api for creating new blog
export const New_Blog = (formData, token) => {
  return API.post("/api/blog/create-blog", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//get api for displaying blogs
export const All_Blogs = (token)=>{
  return API.get('/api/blog/all-blogs',{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}

//get api for displaying details of single blog
export const Single_Blog = (blogId,token)=>{
return API.get(`/api/blog/single-blog/${blogId}`,{
  headers:{
    Authorization: `Bearer ${token}`
  }
})
}

//updating blog
export const Update_Blog = (formData, blogId, token) =>
  API.post(`/api/blog/edit-blog/${blogId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
       "Content-Type": "multipart/form-data",
    },
  });



//----------------api for handling save blogs------------------
//patch api for save blog
export const Save_Blog = (blogId,token)=>{
return API.patch(`/api/auth/save-blog/${blogId}`,{},{
  headers:{
    Authorization: `Bearer ${token}`
  }
})
}

//delete api for unsave blog
export const Unsave_Blog = (blogId,token)=>{
return API.delete(`/api/auth/save-blog/${blogId}`,{
  headers:{
    Authorization: `Bearer ${token}`
  }
})
}

//get api for displaying saved blogs
export const Saved_Blogs = (token)=>{
return API.get('/api/auth/saved-blogs',{
  headers:{
    Authorization: `Bearer ${token}`
  }
})
}


//---------------------------------------Like & Unlike Api------------------------------
// like/unlike
export const Like_Blog = (blogId, token) =>
  API.patch(`/api/blog/like/${blogId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const Unlike_Blog = (blogId, token) =>
  API.patch(`/api/blog/unlike/${blogId}`, {}, { headers: { Authorization: `Bearer ${token}` } });



//-------------------------------comments Api----------------------------
// comments
export const Add_Comment = (blogId, text, token) =>
  API.post(`/api/blog/comment/${blogId}`, { text }, { headers: { Authorization: `Bearer ${token}` } });

export const Delete_Comment = (blogId, commentId, token) =>
  API.delete(`/api/blog/comment/${blogId}/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

export const Update_Comment = (blogId, commentId, text, token) =>
  API.put(
    `/api/blog/${blogId}/comments/${commentId}`,
    { text }, // body with new comment text
    { headers: { Authorization: `Bearer ${token}` } }
  );

//user blogs
  export const User_Blogs = (userId,token)=>
    API.get(
      `/api/blog/user-blogs/${userId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )


//delete blog
 export const Delete_Blog = (blogId,token)=>
    API.delete(
      `/api/blog/delete-blog/${blogId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )


    //-------------------------category  api ----------------------------
  //all categories
   export const All_Categories = (token)=>
    API.get(
      `/api/category/categories`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

  
      //create category
   export const Create_Category = (data,token)=>
    API.post(
      `/api/category/create-category`,data,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )

    //delete category
   export const Delete_Category = (cId,token)=>
    API.delete(`/api/category/delete-category/${cId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )


    // Forgot Password (send recovery email)
export const forgotPassword = (data) =>
  API.post("/api/auth/forgot-password", data);

// Reset Password
export const resetPassword = (token, data) =>
  API.post(`/api/auth/reset-password/${token}`, data);