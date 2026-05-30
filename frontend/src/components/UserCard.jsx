import React from "react";
import { MapPin, Briefcase, X, Heart } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    gender,
    photoUrl,
    skills,
    age,
    profession,
  } = user;

  const handleSendRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      console.log(res);
      dispatch(removeFeed(_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-92.5 rounded-3xl overflow-hidden bg-[#111827] border border-gray-800 shadow-2xl hover:scale-105 transition-all duration-300">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={photoUrl}
            alt="user"
            className="w-full h-[400px] object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent"></div>

          {/* Online Badge */}
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
            Online
          </div>

          {/* User Info On Image */}
          <div className="absolute bottom-5 left-5">
            <h2 className="text-white text-3xl font-bold">
              {firstName} {lastName}
              {age && <span className="text-gray-300 text-xl ml-2">{age}</span>}
            </h2>

            <p className="text-pink-400 text-sm mt-1 capitalize">{gender}</p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {/* Profession */}
          <div className="flex items-center gap-2 text-gray-300 mb-3">
            <Briefcase size={18} />
            <p className="text-sm">{profession}</p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 px-3 py-1 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between items-center gap-4">
            {/* Ignore */}
            <button
              className="flex-1 flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-2xl transition-all duration-300"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              <X size={20} />
              Ignore
            </button>

            {/* Interested */}
            <button
              className="flex-1 flex justify-center items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105 text-white py-3 rounded-2xl shadow-lg transition-all duration-300"
              onClick={() => handleSendRequest("interested", _id)}
            >
              <Heart size={20} fill="white" />
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
