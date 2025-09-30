import {Routes,Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import { Toaster } from "react-hot-toast";
import PageNotFound from './Pages/PageNotFound';
import Register from './Pages/RegisterPage';
import Login from './Pages/LoginPage';
import  Blogs from './Pages/Blogs';
import NewBlog from './Pages/NewBlog';
import SingleBlog from './Pages/SingleBlog';
import UpdateBlog from './Pages/UpdateBlog';
import Protected from './Pages/ProtectedPage/Protected';
import SavedBlogs from './Pages/SavedBlogs';
import YourBlogs from './Pages/YourBlogs';
import AdminProtected from './Pages/ProtectedPage/AdminProtected';
import AdminPage from './Pages/AdminPages/AdminPage';
import AllBlogs from './Pages/AdminPages/AllBlogs';
import AllUsers from './Pages/AdminPages/AllUsers';
import CategoryPage from './Pages/AdminPages/CategoryPage';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResendPassword';

function App() {
  return (

    
      <div className="App">

     <>
     <Routes>
   
      <Route path='/' element={<LandingPage/>}  />
      <Route path='*' element={<PageNotFound/>}  />
      <Route path='/login' element={<Login/>}  />
      <Route path='/register' element={<Register/>}  />
      <Route path='/forgot-password' element={<ForgotPassword/>}  />
      <Route path='/reset-password/:token' element={<ResetPassword/>}  />


      

<Route element={<Protected />}>
  <Route path="/blogs" element={<Blogs />} />
  <Route path="/new-blog" element={<NewBlog />} />
  <Route path='/single-blog' element={<SingleBlog/>}  />
  <Route path='/edit-blog/:blogId' element={<UpdateBlog/>}  />
  <Route path='/saved-blogs' element={<SavedBlogs/>}/>
  <Route path='/your-blogs' element={<YourBlogs/>}/>
</Route>


<Route element={<AdminProtected />}>
  <Route path='/admin' element={<AdminPage/>}/>
   <Route path="/new-blog" element={<NewBlog />} />
  <Route path='/single-blog' element={<SingleBlog/>}  /> 
   <Route path='/all-blogs' element={<AllBlogs/>}  />
   <Route path='/all-users' element={<AllUsers/>}  />
   <Route path='/category' element={<CategoryPage/>}  />


</Route>

     </Routes>
     </>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  
  );
}

export default App;
