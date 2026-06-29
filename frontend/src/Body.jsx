import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "./utils/userSlice";
import { useLocation } from "react-router-dom";
import { socket } from "./utils/socket";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((store) => store.user);
  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));

      console.log("Before connect:", socket.connected);

      socket.connect();

      socket.once("connect", () => {
        console.log("SOCKET CONNECTED");
        console.log("Socket ID:", socket.id);

        socket.emit("userConnected", {
          userId: res.data.data._id,  
        });
      });

      socket.on("connect_error", (err) => {
        console.log("SOCKET ERROR:", err.message);
      });

      console.log("After connect:", socket.connected);

    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(removeUser());
        navigate("/login");
        return;
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/login") {
      return;
    }
    if (!user) {
      fetchUser();
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center items-center px-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
