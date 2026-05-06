require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");
const signUpValidation=require("../utils/validation")
const bcrypt=require("bcrypt")

app.use(express.json());

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    console.log(userEmail)
    const user = await User.findOne({ emailID: userEmail });

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

app.post("/signup", async (req, res) => {
  try {

    signUpValidation(req)
    const {firstName,lastName,emailID,password} = req.body;
    // encrypt password
    const passwordHash=await bcrypt.hash(password,10)
    const user= new User({
      firstName,
      lastName,
      emailID,
      password:passwordHash
    })
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error is :"+err.message)
  }
});

//login api
app.post("/login",async(req,res)=>{
  try{
    const {emailID,password}=req.body

    const user=await User.findOne({emailID:emailID})
    if(!user){
      throw new Error("Invalid Credentials")
    }
    const isPasswordValid= await bcrypt.compare(password,user.password)
    console.log(isPasswordValid)

    if(isPasswordValid){
      res.status(200).send("Login Successful")
    }else{
      throw new Error("Invalid credentials")
    }
  }catch(err){
    res.status(401).send("Error is : "+err.message)
  }
})
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

app.delete("/user",async(req,res)=>{
  
  const user_id=req.body.user_id;
  try{
    const user = await User.findByIdAndDelete(user_id);
    
    if(!user){
      res.status(400).send("User not found");
    }else{
      res.send("User deleted successfully")
    }
  }catch(err){
    res.status(400).send("Something went wrong")
  }

})

app.patch("/user/:userId",async(req,res)=>{
  const userId= req.params.userId;
  const data=req.body;
  try{
    const allowedList=["firstName","lastName","age","gender","photoUrl","skills"];

    const isUpdatedAllowed=Object.keys(data).every((k)=>{
      allowedList.includes(k)
    })
    console.log(isUpdatedAllowed)

    if(!isUpdatedAllowed){
      throw new Error("Update not allowed")
    }

    const user = await User.findByIdAndUpdate(userId,data,{
      returnDocument:"after",//to return updated document 
      runValidators:true, //to enable validate function 
    })
    if(!user){
      res.status(400).send("User not found");
    }
    else{
      res.send("User updated successfuly")
    }
  }catch(err){
    res.status(400).send("Error is : "+err.message)
  }

})




connectDB()
  .then(() => {
    console.log("Database connected successfuly");
    app.listen(process.env.PORT, () => {
      console.log("Server started at port 3000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
