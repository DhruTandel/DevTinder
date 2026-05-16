const jwt=require("jsonwebtoken");
const User = require("../models/User");

const userAuth=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            throw new Error("Invalid token")
        }
        const debuggedData=jwt.verify(token,"devTinder@123")

        const {_id}=debuggedData

        const user=await User.findById({_id})

        if(!user){
            throw new Error("User not found")
        }
        req.user=user;
        next();
    }catch(err){
        res.status(401).send("Error is : "+err.message)
    }
}

module.exports=userAuth