const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signUpValidation } = require("../../utils/validation");
const ApiError = require("../../utils/ApiError");
const sendEmail = require("../../utils/sendEmail");
const cookieParser = require("cookie-parser");
const authRouter = express.Router();

console.log("AUTH FILE LOADED");
authRouter.post("/signup", async (req, res, next) => {
  console.log("SIGNUP ROUTE HIT");
  try {
    signUpValidation(req);
    const {
      firstName,
      lastName,
      emailID,
      password,
      age,
      photoUrl,
      gender,
      skills,
      profession,
    } = req.body;
    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
      age,
      photoUrl,
      gender,
      skills,
      profession,
    });
    const savedUser = await user.save();
    console.log("User Saved :", emailID);
    await sendEmail(
      emailID,
      "Welcome to DevTinder",
      `Hello ${firstName}, Welcome to DevTinder 🚀`,
    );
    console.log("Email sent successfully");
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production ma true
      sameSite: "lax",
    });
    res.status(201).json({
      success: true,
      message: "User Registered succesfully",
      data: savedUser,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(409, "Email ALready exists"));
    }
    next(err);
  }
});

// authRouter.get("/test-email", async (req, res) => {
//   try {
//     await sendEmail(
//       "fallandrise2026@gmail.com",
//       "DevTinder SES Test",
//       "Email successfully sent from Node.js",
//     );

//     res.send("Email Sent");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err.message);
//   }
// });

authRouter.post("/login", async (req, res, next) => {
  try {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //ater login a token will be generated and send back to user
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // production ma true
        sameSite: "lax",
      });
      res.status(200).json({
        success: true,
        message: "Login Successfull",
        data: user,
      });
    } else {
      throw new ApiError(401, "Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.send("You are logged out");
});

module.exports = authRouter;
