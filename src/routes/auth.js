const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const signUpValidation = require("../../utils/validation");

const authRouter=express.Router();


authRouter.post("/signup", async (req, res) => {
  try {
    signUpValidation(req);
    const { firstName, lastName, emailID, password } = req.body;
    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
    });
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error is :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      //ater login a token will be generated and send back to user
      const token = await user.getJWT();

      res.cookie("token", token);
      res.status(200).send("Login Successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(401).send("Error is : " + err.message);
  }
});

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("You are logged out")
})

module.exports=authRouter