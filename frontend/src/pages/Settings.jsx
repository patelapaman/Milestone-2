import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./Settings.css";

export default function Settings() {
  const defaultSettings = {
    threatDetection: true,
    malwareScanner: true,
    intrusionDetection: true,
    emailAlerts: true,
    smsAlerts: false,
    autoRefresh: true,
    darkMode: false,
    refreshInterval: 30,
    theme: "Light",
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("dashboardSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  setSettings((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "theme") {
    if (value === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }
};

  const saveSettings = () => {
    localStorage.setItem(
      "dashboardSettings",
      JSON.stringify(settings)
    );

    alert("Settings Saved Successfully!");
  };

  return (
    <DashboardLayout pageTitle="Settings">

      <div className="settings-grid">

        {/* Security */}
        <div className="settings-card">
          <h2>🛡 Security Settings</h2>

          <Setting
            label="Threat Detection"
            checked={settings.threatDetection}
            onChange={() => handleToggle("threatDetection")}
          />

          <Setting
            label="Malware Scanner"
            checked={settings.malwareScanner}
            onChange={() => handleToggle("malwareScanner")}
          />

          <Setting
            label="Intrusion Detection"
            checked={settings.intrusionDetection}
            onChange={() => handleToggle("intrusionDetection")}
          />
        </div>

        {/* Alerts */}
        <div className="settings-card">
          <h2>🔔 Alert Settings</h2>

          <Setting
            label="Email Alerts"
            checked={settings.emailAlerts}
            onChange={() => handleToggle("emailAlerts")}
          />

          <Setting
            label="SMS Alerts"
            checked={settings.smsAlerts}
            onChange={() => handleToggle("smsAlerts")}
          />

          <Setting
            label="Auto Refresh"
            checked={settings.autoRefresh}
            onChange={() => handleToggle("autoRefresh")}
          />
        </div>

        {/* Preferences */}
        <div className="settings-card">
          <h2>⚙ Dashboard Preferences</h2>

          <label>Theme</label>

          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>

          <label>Refresh Interval</label>

          <input
            type="number"
            name="refreshInterval"
            value={settings.refreshInterval}
            onChange={handleChange}
          />
        </div>

        {/* About */}
        <div className="settings-card">
          <h2>ℹ System Information</h2>

          <div className="info-row">
            <span>Application</span>
            <span>Threat Detection Dashboard</span>
          </div>

          <div className="info-row">
            <span>Version</span>
            <span>1.0.0</span>
          </div>

          <div className="info-row">
            <span>Database</span>
            <span>MongoDB</span>
          </div>

          <div className="info-row">
            <span>Status</span>
            <span className="online">Online</span>
          </div>
        </div>

      </div>

      <div className="save-section">
        <button
          className="save-btn"
          onClick={saveSettings}
        >
          Save Settings
        </button>
      </div>

    </DashboardLayout>
  );
}

function Setting({ label, checked, onChange }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>

      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}