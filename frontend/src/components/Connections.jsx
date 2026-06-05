import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import toast from "react-hot-toast";

const Connections = () => {
  const dispatch = useDispatch();

  const connection = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/users/connections", {
        withCredentials: true,
      });

      dispatch(addConnection(res.data.data));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load connections")
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connection) return;

  if (connection.length === 0)
    return <h1 className="text-center text-2xl mt-10">No Connections Yet</h1>;

  return (
    <div className="min-h-screen px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Connections</h1>

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {connection.map((user) => {
          const {
            _id,
            firstName,
            lastName,
            age,
            gender,
            about,
            skills,
            photoUrl,
          } = user;

          return (
            <div
              key={_id}
              className="
            bg-base-200
            rounded-3xl
            shadow-xl
            p-6
            flex
            flex-col
            md:flex-row
            items-center
            gap-6
            hover:scale-[1.01]
            transition-all
            duration-300
          "
            >
              {/* IMAGE */}
              <div className="flex justify-center">
                <img
                  src={photoUrl}
                  alt="profile"
                  className="
                w-32
                h-32
                rounded-full
                object-cover
                border-4
                border-primary
              "
                />
              </div>

              {/* USER INFO */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold">
                  {firstName} {lastName}
                </h2>

                <p className="text-gray-400 mt-1">
                  {age} years old • {gender}
                </p>

                <p className="mt-4 text-gray-300 leading-relaxed">{about}</p>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                  {skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="
                    px-4
                    py-2
                    rounded-full
                    bg-primary
                    text-white
                    text-sm
                    font-medium
                  "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button className="btn btn-secondary px-8 rounded-2xl">
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
