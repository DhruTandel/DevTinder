import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";
import { BASE_URL } from "./utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      console.log("Error is" + err);
    }
  };

  useEffect(()=>{
    fetchUser();
  },[])

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center px-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Body;
