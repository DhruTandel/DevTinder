import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { socket } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fetchMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      console.log(chat.data.messages);

      const chatMessages = chat?.data?.messages.map((msg) => {
        return {
          senderId: msg?.senderId?._id,
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg?.text,
        };
      });

      setNewMessage(chatMessages);
    } catch (err) {
      console.log("Error in Fetching message :" + err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [targetUserId]);
  useEffect(() => {
    if (!userId || !targetUserId) return;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageRecieved", ({ firstName, text }) => {
      console.log(firstName + " : " + text);
      setNewMessage((prev) => [...prev, { firstName, text }]);
    });

    return () => {
      socket.off("messageRecieved");
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: message,
    });

    // add the sent message locally for instant feedback
    setNewMessage((prev) => [
      ...prev,
      { firstName: user.firstName, text: message, senderId: userId },
    ]);

    setMessage("");
  };
  return (
    <div className="flex w-full  justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="w-full  md:w-[90%] lg:w-[80%]  xl:w-[70%] h-[85vh] bg-base-100 shadow-xl rounded-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content px-6 py-4 flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="mx-auto">Dhru</span>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg">{targetUserId}</h2>
            <p className="text-sm opacity-80">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {newMessage.map((msg, index) => {
            const isSender = msg.senderId && msg.senderId === userId;
            return (
              <div key={index} className={isSender ? "chat chat-end" : "chat chat-start"}>
                <div className={isSender ? "chat-bubble chat-bubble-primary" : "chat-bubble"}>
                  {msg.firstName}: {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Section */}
        <div className="border-t border-base-300 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="input input-bordered flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button onClick={sendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Chat;
