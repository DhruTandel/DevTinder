import React, { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import toast from "react-hot-toast";
import { socket } from "../utils/socket";

const Login = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailID, setEmailID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const loginProgress = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loginProgress.current) return;
    loginProgress.current = true;
    setLoading(true);
    const isValid = validateLogin();
    if (!isValid) {
      loginProgress.current = false;
      setLoading(false);
      return;
    }
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
      socket.connect();

      socket.emit("userConnected", {
        userId: res.data.data._id,
      });
      dispatch(addUser(res.data.data));
      toast.success(res.data.message);
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      loginProgress.current = false;
      setLoading(false);
    }
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = "First Name Required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name Required";
    }
    if (!emailID.trim()) {
      newErrors.emailID = "Email is Required";
    }
    if (emailID && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailID)) {
      newErrors.emailID = "Enter valid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 uppercase and 1 lowercase letter";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!emailID.trim()) {
      newErrors.emailID = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailID)) {
      newErrors.emailID = "Enter valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    const isValid = validateSignUp();
    if (!isValid) {
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailID, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      toast.success(res.data.message);
      return navigate("/profile");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
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

              <label
                className={`input flex items-center gap-3 h-14 rounded-2xl w-full ${
                  error.firstName
                    ? "input-error border-red-500"
                    : "input-bordered"
                }`}
              >
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
                  onChange={(e) => {
                    setFirstName(e.target.value);

                    setError((prev) => ({
                      ...prev,
                      firstName: "",
                    }));
                  }}
                  placeholder="Enter your First Name"
                  className="grow bg-transparent outline-none"
                />
              </label>

              {error.firstName && (
                <p className="text-red-500 text-sm mt-1">{error.firstName}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">
                Last Name
              </label>

              <label
                className={`input flex items-center gap-3 h-14 rounded-2xl w-full ${
                  error.lastName
                    ? "input-error border-red-500"
                    : "input-bordered"
                }`}
              >
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
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);

                    setError((prev) => ({
                      ...prev,
                      lastName: "",
                    }));
                  }}
                  placeholder="Enter your Last Name"
                  className="grow bg-transparent outline-none"
                />
              </label>

              {error.lastName && (
                <p className="text-red-500 text-sm mt-1">{error.lastName}</p>
              )}
            </div>
          </>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Email</label>

          <label
            className={`input flex items-center gap-3 h-14 rounded-2xl w-full ${
              error.emailID ? "input-error border-red-500" : "input-bordered"
            }`}
          >
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
              onChange={(e) => {
                setEmailID(e.target.value);

                setError((prev) => ({
                  ...prev,
                  emailID: "",
                }));
              }}
              placeholder="Enter your email"
              className="grow bg-transparent outline-none"
            />
          </label>

          {error.emailID && (
            <p className="text-red-500 text-sm mt-1">{error.emailID}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium">Password</label>

          <label
            className={`input flex items-center gap-3 h-14 rounded-2xl w-full ${
              error.password ? "input-error border-red-500" : "input-bordered"
            }`}
          >
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

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({
                  ...prev,
                  password: "",
                }));
              }}
              placeholder="Enter your password"
              className="grow bg-transparent outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xl cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </label>

          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-8">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot Password?
          </a>
        </div>

        {/* <p className="text-red-500 my-2 p-2">{error}</p> */}

        {/* Login Button */}
        <button
          className="btn btn-primary w-full h-14 rounded-2xl text-lg font-semibold"
          onClick={isLoginForm ? handleLogin : handleSignUp}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLoginForm ? "Login" : "SignUp"}
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
