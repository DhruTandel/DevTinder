const express = require("express");
const userAuth = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.params;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      })
      .populate({
        path: "participants",
        select: "firstName lastName photoUrl isOnline lastSeen",
      });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
      chat = await Chat.findById(chat._id)
        .populate({
          path: "messages.senderId",
          select: "firstName lastName",
        })
        .populate({
          path: "participants",
          select: "firstName lastName photoUrl isOnline lastSeen",
        });
    }
    res.json(chat);
  } catch (err) {
    console.log("Error in chat Router :" + err);
  }
});

module.exports = chatRouter;
