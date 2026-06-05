const jwt=require("jsonwebtoken");
const User = require("../models/User");
const ApiError=require("../../utils/ApiError")

const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new ApiError(401,"Please Login")
        }
        const debuggedData=jwt.verify(token,process.env.JWT_SECRET)

        const {_id}=debuggedData

        const user=await User.findById(_id)

        if(!user){
            throw new ApiError(404,"User not Found!")
        }
        req.user=user;
        next();
    }catch(err){
        next(err)
    }
}

module.exports=userAuth