import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feedData = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => { 
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      // console.log(res.data)
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feedData) return null;
  if (feedData.length === 0) {
    return <h1>No new Users found</h1>;
  }
  return (
    <>
      {feedData?.map((user) => {
        return <UserCard key={user._id} user={user} />;
      })}
    </>
  );
};

export default Feed;
