require("dotenv").config();
require("./cron/reminderCron")
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const http=require("http");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://3.27.101.13"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("../utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/",paymentRouter)
app.use("/",chatRouter)
app.use(errorHandler);


const server=http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected successfuly");
    server.listen(process.env.PORT, () => {
      console.log("Server started at port 3000");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
