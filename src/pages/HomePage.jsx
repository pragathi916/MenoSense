import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaBars, FaTimes } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth <= 1023) {
        const sidebar = document.querySelector(".sidebar");
        const menuBtn = document.querySelector(".menu-btn");

        if (sidebar && !sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close sidebar when resizing to large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Prevent body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 1023) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <h1 className="logo">MenoSense</h1>
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div className="container">
        {/* Overlay */}
        <div
          className={`overlay ${sidebarOpen ? "show" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="profile-section">
            <img
              src={user?.photoURL || "https://via.placeholder.com/80"}
              alt="Profile"
              className="profile-pic"
            />
            <p className="email">{user?.email || "Guest User"}</p>
          </div>
          <nav className="sidebar-nav">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="nav-link"
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="logout-btn"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="tile">
            <h2>Connect Your Device</h2>
            <p className="tile-description">
              Sync your health monitoring device to track your menopause journey
            </p>
            <button onClick={() => alert("Device Connected!")}>
              Connect Now
            </button>
          </div>

          <div className="tile">
            <h2>Answer Questionnaire</h2>
            <p className="tile-description">
              Complete our comprehensive questionnaire to personalize your
              experience
            </p>
            <button onClick={() => navigate("/questionnaire")}>Start</button>
          </div>

          <div className="tile">
            <h2>Know More About MenoCycle</h2>
            <p className="tile-description">
              Learn about menopause stages and what to expect
            </p>
            <button onClick={() => navigate("/menocycle")}>Learn More</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
