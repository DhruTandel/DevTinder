import React, { useState } from "react";
import { Camera, Briefcase, User, Sparkles } from "lucide-react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  console.log(user)
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [profession, setProfession] = useState(user.profession || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [error, setError] = useState("");
  const [showtoast, setShowToast] = useState(false);
  const navigate=useNavigate()

  const dispatch = useDispatch();

  const handleEditProfile = async () => {
    setError('')
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          gender,
          photoUrl,
          skills,
          age,
          profession,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(()=>{
        setShowToast(false)
        navigate("/")
      },1000)
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      {showtoast && (
        <div className="toast toast-top toast-center fixed z-50">
          <div className="alert alert-success">
            <span>Profile Updated successfully.</span>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-base-300/60 backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-300 rounded-3xl shadow-2xl p-8 sm:p-10">
            {/* HEADING */}
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl font-black mb-3">
                Edit Profile
              </h1>

              <p className="text-base-content/70 text-sm">
                Update your developer profile information
              </p>
            </div>

            {/* FIRST NAME */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">
                First Name
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <User size={18} className="opacity-60" />

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </div>

            {/* LAST NAME */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">
                Last Name
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <User size={18} className="opacity-60" />

                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </div>

            {/* AGE */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">Age</label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <input
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </div>

            {/* PHOTO URL */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">
                Photo URL
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <Camera size={18} className="opacity-60" />

                <input
                  type="text"
                  placeholder="Paste profile photo url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </div>

            {/* PROFESSION */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">
                Profession
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <Briefcase size={18} className="opacity-60" />

                <input
                  type="text"
                  placeholder="Frontend Developer"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="grow bg-transparent"
                />
              </label>
            </div>

            {/* GENDER */}
            <div className="mb-5">
              <label className="text-sm font-semibold mb-2 block">Gender</label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full h-14 rounded-2xl bg-base-200"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* SKILLS */}
            <div className="mb-8">
              <label className="text-sm font-semibold mb-2 block">Skills</label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl bg-base-200 w-full">
                <Sparkles size={18} className="opacity-60" />

                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value.split(","))}
                  className="grow bg-transparent"
                />
              </label>
            </div>
            <p className="text-red-500 my-2 p-2">{error}</p>

            {/* BUTTON */}
            <button
              className="btn btn-primary w-full h-14 rounded-2xl text-lg font-bold tracking-wide"
              onClick={handleEditProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
        <UserCard
          user={{
            firstName,
            lastName,
            gender,
            photoUrl,
            skills,
            age,
            profession,
          }}
        />
      </div>
    </>
  );
};

export default EditProfile;
