// pages/Register.jsx - Fixed version
import React, { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, signInWithGoogle } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Full Name is required!");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required!");
      return;
    }
    if (!password) {
      toast.error("Password is required!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredentials.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        email: newUser.email,
        firstName: fullName.split(" ")[0] || "",
        lastName: fullName.split(" ")[1] || "",
        img: "",
        createdAt: new Date().toISOString(),
      });

      console.log("User registered & saved to Firestore");
      
      // Clear form fields
      setFullName("");
      setEmail("");
      setPassword("");
      
      toast.success("Registration successful!");
      
    } catch (err) {
      console.error("Registration error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error("Email already registered. Please login instead.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format!");
          break;
        case "auth/weak-password":
          toast.error("Password is too weak. Use at least 6 characters.");
          break;
        case "auth/operation-not-allowed":
          toast.error("Email registration is not enabled!");
          break;
        default:
          toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Add loading toast for better UX
      const loadingToast = toast.loading("Signing up with Google...");
      
      await signInWithGoogle();
      
      toast.dismiss(loadingToast);
      toast.success("Google registration successful!");
    } catch (error) {
      toast.dismiss(); // Remove any loading toasts
      console.error("Google sign-in error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-up cancelled");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup blocked. Please allow popups and try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        // Don't show error for this, user likely clicked multiple times
        return;
      } else {
        toast.error("Google sign-up failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="max-w-[100%] mx-auto">
      <div className="flex items-center justify-between text-purple-500 font-bold mt-5 p-1">
        <Link to="/login">
          <div className="cursor-pointer flex items-center text-xs">
            <MdArrowBackIos />
            Back to login
          </div>
        </Link>
      </div>

      <h1 className="text-2xl text-white-800 font-medium text-center mt-5 p-2">
        Registration
      </h1>
      <p className="text-white-500 leading-5 mb-2 text-center">
        Fill the details to register
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <label className="relative">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full outline-none border border-gray-400 focus:border-purple-500 transition duration-200"
          />
          <span className="absolute top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {fullName ? "" : "Full Name"}
          </span>
        </label>

        <label className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full outline-none border border-gray-400 focus:border-purple-500 transition duration-200"
          />
          <span className="absolute top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {email ? "" : "Email"}
          </span>
        </label>

        <label className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-2 mx-1 w-[270px] xs:w-[360px] md:w-[450px] px-6 py-3 rounded-full outline-none border border-gray-400 focus:border-purple-500 transition duration-200"
          />
          <span className="absolute w-[80px] top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {password ? "" : "Password"}
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-[270px] xs:w-[360px] md:w-[450px] bg-purple-500 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed p-2 text-white text-base rounded-full mt-5 transition duration-200"
        >
          {loading ? "Registering..." : "Register"}
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
          className="w-[270px] xs:w-[360px] md:w-[450px] p-2 :bg-gray-50 disabled:cursor-not-allowed border-gray-200 border text-base font-medium rounded-full mt-5 flex items-center justify-center transition duration-200"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png"
            alt="Google"
            className="h-[25px] md:h-[28px] mr-[6px]"
          />
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>
        
        <div className="text-white-600 mt-2 mb-5">
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-purple-500 font-medium">Login</span>
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

export default Register;