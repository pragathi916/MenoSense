// pages/Login.jsx - Fixed version
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { auth, signInWithGoogle } from "../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [data, setData] = useState(initialState);
  const { email, password } = data;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      setData(initialState); // Clear fields
    } catch (err) {
      console.error("Login error:", err);
      switch (err.code) {
        case "auth/invalid-email":
          toast.error("Invalid email format!");
          break;
        case "auth/user-not-found":
          toast.error("User not found. Please register first!");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password!");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed attempts. Try again later!");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid email or password!");
          break;
        case "auth/user-disabled":
          toast.error("This account has been disabled!");
          break;
        default:
          toast.error("Login failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Add loading toast for better UX
      const loadingToast = toast.loading("Signing in with Google...");
      
      await signInWithGoogle();
      
      toast.dismiss(loadingToast);
      toast.success("Google sign-in successful!");
    } catch (error) {
      toast.dismiss(); // Remove any loading toasts
      console.error("Google sign-in error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Don't show error for this, user likely clicked multiple times
        return;
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email first!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password reset error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No account found with this email!");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format!");
          break;
        default:
          toast.error("Failed to send reset email. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="flex items-center justify-between text-purple-500 font-bold mt-5 p-1">
        <Link to="/register">
          <div className="cursor-pointer flex items-center text-xs">
            <MdArrowBackIos />
            Back to register
          </div>
        </Link>
      </div>

      <h1 className="text-2xl text-white-800 text-center font-medium mt-5 p-2">
        Login
      </h1>
      <p className="text-white-500 leading-5 text-center mb-2">
        Sign in to continue
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <label className="relative">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full outline-none border border-gray-400 focus:border-purple-500 transition duration-200 text-gray-900 bg-white"
          />
          <span className="absolute top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {email ? "" : "Email"}
          </span>
        </label>

        <label className="relative">
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full outline-none border border-gray-400 focus:border-purple-500 transition duration-200 text-gray-900 bg-white"
          />
          <span className="absolute w-[80px] top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {password ? "" : "Password"}
          </span>
        </label>

        {/* Forgot Password Link */}
        <div className="w-[270px] xs:w-[360px] md:w-[450px] text-right mt-2">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-purple-500 text-sm hover:text-purple-600 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-[270px] xs:w-[360px] md:w-[450px] bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 disabled:cursor-not-allowed text-white text-base font-medium rounded-full mt-5 py-2 transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="flex items-center justify-center mt-5 text-gray-500">
        <div className="border w-[200px] border-gray-300 mr-1" />
        OR
        <div className="border w-[200px] border-gray-300 ml-1"></div>
      </div>

      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-[270px] xs:w-[360px] md:w-[450px] bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-black text-base font-medium rounded-full mt-5 py-2 flex items-center justify-center transition duration-200"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png"
            alt="Google"
            className="h-[25px] md:h-[28px] mr-[6px]"
          />
          {loading ? "Signing in..." : "Login with Google"}
        </button>

        <div className="text-white-600 mt-2 mb-5">
          Don't have an account?{" "}
          <Link to="/register">
            <span className="text-purple-500 font-medium">Register here</span>
          </Link>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;