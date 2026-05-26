const express = require("express");
const userAuth = require("../middlewares/auth");
const { validateProfileData } = require("../../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

// to get data of our profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Please Login");
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res
      .status(200)
      .json({ message: "Profile Updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("errror is : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordValid = await req.user.validatePassword(oldPassword);

    if (!isOldPasswordValid) {
      throw new Error("Enter correct password to change");
    }
    const isPasswordValid = validator.isStrongPassword(newPassword);
    if (!isPasswordValid) {
      throw new Error(
        "Password should contain 1 uppercase, 1 lower case and special character and must be 6 charcter long",
      );
    }
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = newHashPassword;
    await req.user.save();
    res.json({message:"Password changed successfully"});
  } catch (err) {
    res.status(400).send("error is : " + err.message);
  }
});

module.exports = profileRouter;
