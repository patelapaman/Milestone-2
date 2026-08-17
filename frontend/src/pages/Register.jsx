import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { registerRequest } from "../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerRequest(
        form.name,
        form.email,
        form.password
      );

      alert("Account created successfully!");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-backdrop">
        <div className="login-grid-lines"></div>
        <div className="login-glow login-glow-cyan"></div>
        <div className="login-glow login-glow-violet"></div>
      </div>

      <div className="login-card">

        <div className="login-brand">
          <div className="login-brand-mark">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h1>Threat Detection Dashboard</h1>
            <p>Create your analyst account</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Create Account</h2>
          <p>Register to access the dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="login-field">
            <label className="login-field-label">Full Name</label>

            <div className="login-input-wrap">
              <User className="login-input-icon" size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Email</label>

            <div className="login-input-wrap">
              <Mail className="login-input-icon" size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Password</label>

            <div className="login-input-wrap">

              <Lock className="login-input-icon" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="login-toggle-visibility"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">
              Confirm Password
            </label>

            <div className="login-input-wrap">

              <Lock className="login-input-icon" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        <p className="login-footnote">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </p>

      </div>

    </div>
  );
}