const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectRequestModel = require("../models/connectionRequest");
const mongoose = require("mongoose");
const User = require("../models/User");
const ApiError = require("../../utils/ApiError");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid status type");
      }
      // check if id is valid or not
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new ApiError(400, "Invalid User ID");
      }

      // check user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new ApiError(404, "User not found");
      }

      // check self request
      if (fromUserId.toString() === toUserId) {
        throw new ApiError(400, "Cannot send request to yourself");
      }

      // duplicate request
      const existingConnectionRequest = await ConnectRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new ApiError(409, "Connection request ALready Exists");
      }

      // create request
      const connectionRequest = new ConnectRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      let message = "";
      if (status === "interested") {
        message = "Connection request sent successfully";
      } else if (status === "ignored") {
        message = "User ignored";
      }
      res.status(201).json({ success: true, message, data });
    } catch (err) {
      next(err);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid status type");
      }
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        throw new ApiError(400, "Invalid request ID");
      }

      const connectionRequest = await ConnectRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new ApiError(404, "Connection request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.status(200).json({success:true, message: "Connection requested " + status, data });
    } catch (err) {
      res.status(400).send("Error is :" + err.message);
    }
  },
);

module.exports = requestRouter;
