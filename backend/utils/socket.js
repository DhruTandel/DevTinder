const socket = require("socket.io");
const Chat = require("../src/models/chat");
const User = require("../src/models/User");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", "http://3.27.101.13"],credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("userConnected", async ({ userId }) => {
      socket.userId = userId;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isOnline: true,
        },
        { returnDocument: "after" },
      );

      io.emit("userStatusChanged", {
        userId,
        isOnline: true,
      });
    });

    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {

      const roomId = [userId, targetUserId].sort().join("_");

      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          const latestMessage = chat.messages[chat.messages.length - 1];
          io.to(roomId).emit("messageRecieved", {
            senderId: userId,
            firstName,
            text,
            createdAt: latestMessage.createdAt,
          });
        } catch (err) {
          console.log("Error in socket :" + err);
        }
      },
    );
    socket.on("disconnect", async () => {
      try {
        if (!socket.userId) return;

        const updatedUser = await User.findByIdAndUpdate(
          socket.userId,
          {
            isOnline: false,
            lastSeen: new Date(),
          },
          { new: true },
        );

        if (!updatedUser) return;

        io.emit("userStatusChanged", {
          userId: socket.userId,
          isOnline: false,
          lastSeen: updatedUser.lastSeen,
        });
      } catch (err) {
        console.log("Disconnect Error:", err);
      }
    });
  });
};

module.exports = initializeSocket;
