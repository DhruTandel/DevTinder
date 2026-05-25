import React from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user=useSelector((store)=>store.user)
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm px-4">
        {/* Left Side */}
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">DevTinder</a>
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
                <img
                  alt="Profile"
                  src={user.photoUrl}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-primary">New</span>
                </a>
              </li>

              <li>
                <a>Settings</a>
              </li>

              <li>
                <a>Logout</a>
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
