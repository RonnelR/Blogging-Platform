//checks for valid tokens
import jwt from 'jsonwebtoken'

export const isSignInRequired = async (req,res,next)=>{

try {

    //getting token from headers ,middleware for sign in check
const authHeader = req.headers.authorization;

if(!authHeader || !authHeader.startsWith('Bearer ') ){
   return res.status(401).json({
        success:false,
        message:'token missing!'
    })
}

//fetching token after "Bearer "<token>
const token = req.headers.authorization?.split(" ")[1];



    //verifing token
    const verified = await jwt.verify(token,process.env.JWT_SECRET)
   
 req.user = verified,
    next()
    

} catch (error) {
    return res.status(401).json({
        success:false,
        message:'Something went wrong!',
        error
    })
}

}

//Checking admin middleware
export const isAdmin = (req,res,next) =>{
    try {
        const user = req.user;
if(user.role !== 'admin' ){
    return res.status(401).json({
        success:false,
        message:'Unauthorized user',
    })
}else{
    next()
}

    } catch (error) {
        return  res.status(401).json({
        success:false,
        message:'Something went wrong!',
        error   
    })
    }
}