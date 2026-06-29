import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import toast from "react-hot-toast";

const Feed = () => {
  const feedData = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res)
      dispatch(addFeed(res.data.data));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load feed");
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
      {/* {feedData?.map((user) => {
        return <UserCard key={user._id} user={user} />;
      })} */}
      <div className="w-full flex justify-center items-center py-10">
        <UserCard user={feedData[0]} />
      </div>
    </>
  );
};

export default Feed;
