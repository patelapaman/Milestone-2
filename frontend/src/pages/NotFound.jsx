import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background: "var(--bg-deep)",
        color: "var(--text-primary)",
        textAlign: "center",
        padding: 24,
      }}
    >
      <ShieldAlert size={40} color="var(--signal-high)" />
      <h1 style={{ margin: 0, fontFamily: "var(--font-display)" }}>404</h1>
      <p style={{ color: "var(--text-secondary)", margin: 0 }}>
        This page doesn't exist or you don't have access to it.
      </p>
      <Link to="/dashboard" style={{ color: "var(--accent)", marginTop: 8 }}>
        Back to dashboard
      </Link>
    </div>
  );
}
