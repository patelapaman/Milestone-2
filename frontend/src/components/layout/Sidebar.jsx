import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldHalf,
  LayoutDashboard,
  ListTree,
  Radar,
  Bug,
  Siren,
  FileBarChart,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./Sidebar.css";

// Nav items map 1:1 to the platform's modules.
const NAV_ITEMS = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
  {
    label: "Security Events",
    path: "/dashboard/events",
    icon: ListTree,
  },
  {
    label: "Threat Distribution",
    path: "/dashboard/threats",
    icon: Radar,
  },
  {
    label: "Vulnerabilities",
    path: "/dashboard/vulnerabilities",
    icon: Bug,
  },
  {
    label: "Incidents",
    path: "/dashboard/incidents",
    icon: Siren,
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: FileBarChart,
  },
  {
    label: "AI Detection",
    path: "/dashboard/ai-detection",
    icon: BrainCircuit,
  },
];

/**
 * Sidebar
 *
 * Props:
 *  - collapsed: bool
 *  - mobileOpen: bool
 *  - onCloseMobile: fn
 *  - onToggleCollapse: fn
 */

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop only shows on mobile */}
      <div
        className={`sidebar-backdrop ${
          mobileOpen ? "is-visible" : ""
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${collapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">
            <ShieldHalf size={22} strokeWidth={2.25} />
          </div>

          {!collapsed && (
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">
                INFOSYS SPRINGBOARD 7.0
              </span>
              <span className="sidebar-brand-subtitle">
                Cybersecurity Operations
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(
            ({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "is-active" : ""
                  }`
                }
                title={collapsed ? label : undefined}
              >
                <span className="sidebar-link-icon">
                  <Icon size={19} strokeWidth={2} />
                </span>

                {!collapsed && (
                  <span className="sidebar-link-label">
                    {label}
                  </span>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Settings */}
          <NavLink
            to="/dashboard/settings"
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? "is-active" : ""
              }`
            }
            title={collapsed ? "Settings" : undefined}
          >
            <span className="sidebar-link-icon">
              <Settings size={19} strokeWidth={2} />
            </span>

            {!collapsed && (
              <span className="sidebar-link-label">
                Settings
              </span>
            )}
          </NavLink>

          {/* Logout */}
          <button
            type="button"
            className="sidebar-link sidebar-logout"
            title={collapsed ? "Log out" : undefined}
            onClick={handleLogout}
          >
            <span className="sidebar-link-icon">
              <LogOut size={19} strokeWidth={2} />
            </span>

            {!collapsed && (
              <span className="sidebar-link-label">
                Log out
              </span>
            )}
          </button>

          {/* Collapse Button */}
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <>
                <ChevronsLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}