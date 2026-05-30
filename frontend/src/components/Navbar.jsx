import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate('/login')
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4">
        {/* Left Side */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            DevTinder
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex-none flex items-center gap-2 mx-4">
          {/* Profile Dropdown */}
          {user && (
            <div className="dropdown dropdown-end flex items-center gap-5 ">
              <p className="text-3xl">Welcome, {user.firstName}</p>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="Profile" src={user.photoUrl} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge badge-primary">New</span>
                  </Link>
                </li>

                <li>
                  <Link to={"/connections"}>Friends</Link>
                </li>
                <li>
                  <Link to={"/requests"}>Requests</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
