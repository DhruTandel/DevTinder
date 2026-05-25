require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/User");
const signUpValidation = require("../utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth=require("./middlewares/auth")
const cors=require("cors")

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter)
app.use("/",requestRouter)
app.use("/",profileRouter)
app.use("/",userRouter)



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
