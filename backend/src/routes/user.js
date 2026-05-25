const express = require("express");
const userAuth = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const userRouter = express.Router();
const userData = "firstName lastName age gender skills photoUrl";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", userData);
    if (connectionRequests.length === 0) {
      return res.status(200).json({ message: "No active Requests", data: [] });
    }
    res.json({
      message: "Request fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error is : " + err.message);
  }
});

userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          { toUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", userData)
      .populate("toUserId", userData);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error is : " + err.message);
  }
});

userRouter.get("/users/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page=parseInt(req.query.page) || 1
    let limit=parseInt(req.query.limit) || 10;
    limit=limit>50?50:limit;
    const skip=(page-1)*limit;

    const connectionRequests = await connectionRequest
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and:[
        {_id:{$nin:Array.from(hideUsersFromFeed)}},
        {_id:{$ne:loggedInUser._id}},
      ]
    }).select(userData).skip(skip).limit(limit);

    res.status(200).send(users)
  } catch (err) {
    res.status(400).send("Error is : " + err.message);
  }
});
module.exports = userRouter;
