const express = require("express");
const userAuth=require("../middlewares/auth")

const requestRouter=express.Router();

requestRouter.post("/connectionRequest",userAuth,async(req,res)=>{
  try{
    const user=req.user;

    res.send(user.firstName+" send connection request")
    // res.send("Connection req send")
  }catch(err){
    res.status(400).send("Error is : "+err.message)
  }
})

module.exports=requestRouter;