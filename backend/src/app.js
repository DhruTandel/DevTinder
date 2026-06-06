require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors=require("cors");
const errorHandler =require("./middlewares/errorHandler")

app.use(cors({
  origin:[
  "http://localhost:5173",
  "http://32.236.185.162"
],
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
app.use(errorHandler)



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
