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
    if (feedData) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res)
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);


  if(!feedData){
    return <h1>Loading....</h1>
  }
  return (
    <>
      <UserCard user={feedData[0]} />
    </>
  );
};

export default Feed;
