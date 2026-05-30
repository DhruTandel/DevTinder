import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailID,
          password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };
  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailID, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data))
       return navigate("/profile");
    } catch (err) {
      setError(err?.response?.message || "something went wrong");
    }
  };

  return (
    <div className="w-full max-w-lg px-4">
      <div className="bg-base-300/80 backdrop-blur-xl border border-base-content/10 shadow-2xl rounded-3xl p-8 sm:p-10">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10">
          {isLoginForm ? "Login" : "Sign UP"}
        </h1>
        {!isLoginForm && (
          <>
            {" "}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                First Name
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl w-full">
                {/* Email Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 opacity-70 stroke-current flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1m18 0-7.89 5.26a2 2 0 0 1-2.22 0L3 8m18 0v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"
                  />
                </svg>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your First Name"
                  className="grow bg-transparent outline-none"
                />
              </label>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Last Name
              </label>

              <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl w-full">
                {/* Email Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 opacity-70 stroke-current flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1m18 0-7.89 5.26a2 2 0 0 1-2.22 0L3 8m18 0v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"
                  />
                </svg>

                <input
                  type="email"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your Last Name"
                  className="grow bg-transparent outline-none"
                />
              </label>
            </div>
          </>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Email</label>

          <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl w-full">
            {/* Email Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 opacity-70 stroke-current flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1m18 0-7.89 5.26a2 2 0 0 1-2.22 0L3 8m18 0v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"
              />
            </svg>

            <input
              type="email"
              value={emailID}
              onChange={(e) => setEmailID(e.target.value)}
              placeholder="Enter your email"
              className="grow bg-transparent outline-none"
            />
          </label>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium">Password</label>

          <label className="input input-bordered flex items-center gap-3 h-14 rounded-2xl w-full">
            {/* Lock Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-5 w-5 opacity-70 stroke-current flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm3-10V9a3 3 0 1 1 6 0v2H9Z"
              />
            </svg>

            {/* Password Input */}
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="grow bg-transparent outline-none"
            />

            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xl cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </label>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-8">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot Password?
          </a>
        </div>

        <p className="text-red-500 my-2 p-2">{error}</p>

        {/* Login Button */}
        <button
          className="btn btn-primary w-full h-14 rounded-2xl text-lg font-semibold"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "SignUp"}
        </button>

        {/* Signup */}
        <p className="text-center text-sm mt-8 text-base-content/70">
          {isLoginForm ? (
            <>
              {" "}
              Don&apos;t have an account?{" "}
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => setIsLoginForm(false)}
              >
                Signup
              </span>
            </>
          ) : (
            <>
              Already an user?{" "}
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => setIsLoginForm(true)}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
