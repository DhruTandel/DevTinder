const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender data is not correct");
        }
      },
    },
    profession:{
      type:String,
    },
    photoUrl: {
      type: String,
      default:
        "https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword=async function(inputPassword){
  const user = this;

  const isPasswordValid=await bcrypt.compare(inputPassword,user.password)

  return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);
