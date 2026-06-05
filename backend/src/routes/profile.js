const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateProfileData } = require("../../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const ApiError = require("../../utils/ApiError");


const profileRouter = express.Router();

// to get data of our profile
profileRouter.get("/profile/view", userAuth, async (req, res,next) => {
  try {
   
    res.status(200).json({
      success:true,
      message:"Profile fetched successfully",
      data:req.user
    });
  } catch (err) {
   next(err)
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res,next) => {
  try {
    if (!validateProfileData(req)) {
      throw new ApiError(400,"Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();


    res
      .status(200)
      .json({ success:true,message: "Profile Updated successfully", data: loggedInUser });
  } catch (err) {
    next(err)
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res,next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordValid = await req.user.validatePassword(oldPassword);

    if (!isOldPasswordValid) {
      throw new ApiError(401,"Enter correct password to change");
    }
    const isPasswordValid = validator.isStrongPassword(newPassword);
    if (!isPasswordValid) {
      throw new ApiError(
        400, "Password should contain 1 uppercase, 1 lower case and special character and must be 6 charcter long",
      );
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = newHashPassword;
    await req.user.save();
    res.status(200).json({success:true,message:"Password changed successfully"});
  } catch (err) {
    next(err)
  }
});



module.exports = profileRouter;
