import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { ShieldHalf, Mail, Lock, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip straight to the dashboard.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-backdrop" aria-hidden="true">
        <div className="login-grid-lines" />
        <div className="login-glow login-glow-cyan" />
        <div className="login-glow login-glow-violet" />
      </div>

      <div className="login-telemetry" aria-hidden="true">
        <span className="telemetry-chip chip-a">SYSTEM ONLINE</span>
        <span className="telemetry-chip chip-b">AI ENGINE READY</span>
        <span className="telemetry-chip chip-c">THREAT MONITORING</span>
        <span className="telemetry-line line-a" />
        <span className="telemetry-line line-b" />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">
            <ShieldHalf size={26} strokeWidth={2.25} />
          </div>
          <div>
            <h1>INFOSYS SPRINGBOARD 7.0</h1>
            <p>AI-powered Security Operations Center</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Secure analyst access</h2>
          <p>Authenticate to access the security operations workspace.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="login-field">
            <span className="login-field-label">Work email</span>
            <div className="login-input-wrap">
              <Mail size={16} className="login-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.com"
                autoComplete="email"
                disabled={submitting}
              />
            </div>
          </label>

          <label className="login-field">
            <span className="login-field-label">Password</span>
            <div className="login-input-wrap">
              <Lock size={16} className="login-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
              />
              <button
                type="button"
                className="login-toggle-visibility"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="login-row">
            <label className="login-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button type="button" className="login-forgot">
              Forgot password?
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? (
              <>
                <LoaderCircle size={16} className="spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="login-footnote">
  Demo build — any email + a password of 4+ characters signs you in.
</p>

<div
  style={{
    textAlign: "center",
    marginTop: "16px",
    fontSize: "13px",
    color: "var(--text-secondary)"
  }}
>
  Don't have an account?{" "}
  <Link
    to="/register"
    style={{
      color: "var(--accent)",
      textDecoration: "none",
      fontWeight: 600
    }}
  >
    Create Account
  </Link>
</div>
      </div>
    </div>
  );
}
