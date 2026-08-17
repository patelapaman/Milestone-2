import React, { useState, useRef, useEffect, useCallback } from "react";
import { Menu, Search, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import "./Navbar.css";

export default function Navbar({
  onToggleMobile,
  pageTitle = "Overview",
  searchQuery,
  setSearchQuery,
}) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const profileRef = useRef(null);

  const notificationRef = useRef(null);

  // ---------------- Notifications ----------------

  useEffect(() => {
    fetch(`${API_BASE_URL}/notifications/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else if (data.data) {
          setNotifications(data.data);
        } else {
          setNotifications([]);
        }
      })
      .catch(() => setNotifications([]));
  }, []);

  // ---------------- Search ----------------

 
  // ---------------- Menus ----------------

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotificationOpen(false);
  };

  const toggleNotification = () => {
    setNotificationOpen((prev) => !prev);
    setProfileOpen(false);
  };

  // ---------------- Close Outside ----------------

  useEffect(() => {
    const closeMenus = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenus);

    return () =>
      document.removeEventListener("mousedown", closeMenus);
  }, []);

  // ---------------- Navigation ----------------

  const handleProfile = () => {
    setProfileOpen(false);

    navigate(`/dashboard/profile/${user.id}`);
  };

  const handlePreferences = () => {
    setProfileOpen(false);

    navigate("/dashboard/settings");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="navbar">

      {/* LEFT */}

      <div className="navbar-left">

        <button
          className="navbar-icon-btn navbar-menu-btn"
          onClick={onToggleMobile}
        >
          <Menu size={20} />
        </button>

        <div className="navbar-title-block">

          <h1 className="navbar-page-title">
            {pageTitle}
          </h1>

          <p className="navbar-page-sub">
            Real-time Cybersecurity Monitoring
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="navbar-center">

        <div className="navbar-search">

          <Search
            size={18}
            className="navbar-search-icon"
          />

          <input
            type="text"
            placeholder="Search Events, CVEs, IP..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery?.(e.target.value)}
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="navbar-right">

        {/* Theme */}
        <button
          className="navbar-icon-btn theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* Live */}

        <div className="live-status">

          <span className="live-dot"></span>

          <span className="live-text">
            Live
          </span>

        </div>

        {/* Notifications */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >

          <button
            className="navbar-icon-btn"
            onClick={toggleNotification}
          >

            <Bell size={20} />

            {notifications.length > 0 && (

              <span className="navbar-badge">
                {notifications.length}
              </span>

            )}

          </button>

          {notificationOpen && (

            <div className="notification-menu">

              <div className="notification-header">
                Notifications
              </div>

              {notifications.length === 0 ? (

                <div className="notification-empty">
                  No Notifications
                </div>

              ) : (

                notifications.map((item, index) => (

                  <div
                    className="notification-item"
                    key={item.id || index}
                  >

                    <div className="notification-title">
                      {item.title}
                    </div>

                    <div className="notification-message">
                      {item.message}
                    </div>

                    <div className="notification-time">
                      {item.time}
                    </div>

                  </div>

                ))

              )}

            </div>

          )}

        </div>

        {/* Profile */}

        <div
          className="navbar-profile"
          ref={profileRef}
        >

          <button
            className="navbar-profile-btn"
            onClick={toggleProfile}
          >

            <div className="navbar-avatar">

              {user?.name
                ? user.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                : "--"}

            </div>

            <span className="navbar-profile-name">

              {user?.name || "Loading..."}

            </span>

            <ChevronDown
              size={16}
              className={profileOpen ? "rotate" : ""}
            />

          </button>

          {profileOpen && (

            <div className="navbar-profile-menu">

              <button onClick={handleProfile}>
                👤 My Profile
              </button>

              <button onClick={handlePreferences}>
                ⚙ Preferences
              </button>

              <button
                className="danger"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}