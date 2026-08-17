import React, { useState, cloneElement } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./DashboardLayout.css";

/**
 * DashboardLayout
 * The shared shell for every authenticated screen. Wrap each page's
 * content with this component, e.g. inside App.jsx's routes:
 *
 *   <Route
 *     path="/dashboard/*"
 *     element={
 *       <DashboardLayout pageTitle="Overview">
 *         <Dashboard />
 *       </DashboardLayout>
 *     }
 *   />
 *
 * Props:
 *  - pageTitle: string  -> forwarded to the Navbar
 *  - children: node     -> the page content (KPI cards, charts, table, etc.)
 */
export default function DashboardLayout({ pageTitle, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-shell">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div
        className={`dashboard-main ${collapsed ? "sidebar-collapsed" : ""}`}
      >
        <Navbar
          pageTitle={pageTitle}
          onToggleMobile={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="dashboard-content">{React.isValidElement(children) ? cloneElement(children, { searchQuery }) : children}</main>
      </div>
    </div>
  );
}
