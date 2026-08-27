import { register } from "../services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from "lucide-react";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
    setSuccessMessage("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required";
    else if (form.name.trim().length < 2)
      next.name = "Name must be at least 2 characters";

    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";

    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)
      next.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match";

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setSubmitting(true);

    try {
      const data = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccessMessage(
        data.message || "Account created successfully! Redirecting..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      {/* Header */}
      <header className="register-header">
        <Link to="/" className="register-header__brand">
          <LogoMark />
          <span className="register-header__brand-name">SkillCraft</span>
        </Link>
        <Link to="/" className="register-header__home">
          Home
        </Link>
      </header>

      {/* Main */}
      <main className="register-main">
        <div className="register-card">
          {/* Left panel - Illustration */}
          <div className="register-illustration-panel">
            <BackgroundBlobs />

            <div className="register-illustration-panel__intro">
              <h2 className="register-illustration-panel__title">
                Join SkillCraft!
              </h2>
              <p className="register-illustration-panel__subtitle">
                Start learning from expert tutors and build real, marketable
                skills.
              </p>
            </div>

            <RegisterIllustration className="register-illustration-panel__art" />
          </div>

          {/* Right panel - Form */}
          <div className="register-form-panel">
            <h1 className="register-form-panel__title">Create Account</h1>

            <form onSubmit={handleSubmit} noValidate className="register-form">
              <div className="register-field">
                <label htmlFor="name">Full Name</label>
                <div className="register-input-wrap">
                  <User size={18} className="register-input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`register-input ${
                      errors.name ? "register-input--error" : ""
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="register-field__error">{errors.name}</p>
                )}
              </div>

              <div className="register-field">
                <label htmlFor="email">Email Address</label>
                <div className="register-input-wrap">
                  <Mail size={18} className="register-input-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`register-input ${
                      errors.email ? "register-input--error" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="register-field__error">{errors.email}</p>
                )}
              </div>

              <div className="register-field">
                <label htmlFor="password">Password</label>
                <div className="register-input-wrap">
                  <Lock size={18} className="register-input-icon" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className={`register-input ${
                      errors.password ? "register-input--error" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="register-password-toggle"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="register-field__error">{errors.password}</p>
                )}
              </div>

              <div className="register-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="register-input-wrap">
                  <Lock size={18} className="register-input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`register-input ${
                      errors.confirmPassword ? "register-input--error" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="register-password-toggle"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="register-field__error">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="register-field">
                <label htmlFor="role">I want to join as</label>
                <div className="register-role-select">
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="register-select"
                  >
                    <option value="student">Student - Learn new skills</option>
                    <option value="tutor">Tutor - Teach my skills</option>
                  </select>
                </div>
              </div>

              {errors.submit && (
                <p className="register-field__error register-field__error--submit">
                  {errors.submit}
                </p>
              )}

              {successMessage && (
                <p className="register-success">{successMessage}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="register-submit"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
              <p className="register-login">
                Already have an account? <Link to="/login">Log in here</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Presentational Components ---------- */

function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 1 L24 7 L13 13 L2 7 Z" fill="#9333EA" />
      <path d="M13 13 L24 7 V17 L13 23 Z" fill="#C084FC" />
      <path d="M13 13 L2 7 V17 L13 23 Z" fill="#7C3AED" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.7 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.9 39.7 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function BackgroundBlobs() {
  return (
    <svg
      className="register-illustration-panel__blobs"
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bubbleGradSoft" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#C084FC" />
        </radialGradient>
      </defs>
      <circle
        cx="30"
        cy="60"
        r="11"
        fill="url(#bubbleGradSoft)"
        stroke="#D8B4FE"
        strokeWidth="1"
        opacity="0.9"
      />
      <circle
        cx="360"
        cy="120"
        r="15"
        fill="url(#bubbleGradSoft)"
        stroke="#D8B4FE"
        strokeWidth="1"
        opacity="0.9"
      />
      <circle
        cx="345"
        cy="330"
        r="9"
        fill="url(#bubbleGradSoft)"
        stroke="#D8B4FE"
        strokeWidth="1"
        opacity="0.85"
      />
      <circle cx="60" cy="400" r="6" fill="#C084FC" opacity="0.5" />
      <path
        d="M-40 500C40 420 60 300 20 220C-20 140 60 60 140 -20"
        stroke="#F3E8FF"
        strokeWidth="60"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function RegisterIllustration({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="bubbleGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#C084FC" />
        </radialGradient>
        <linearGradient id="leafGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DDD6FE" />
          <stop offset="100%" stopColor="#B794F4" />
        </linearGradient>
        <linearGradient id="leafGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>

      <circle
        cx="34"
        cy="70"
        r="8"
        fill="url(#bubbleGrad)"
        stroke="#D8B4FE"
        strokeWidth="1"
      />
      <circle
        cx="24"
        cy="150"
        r="10"
        fill="url(#bubbleGrad)"
        stroke="#D8B4FE"
        strokeWidth="1"
      />
      <circle
        cx="46"
        cy="182"
        r="7"
        fill="url(#bubbleGrad)"
        stroke="#D8B4FE"
        strokeWidth="1"
      />
      <circle
        cx="206"
        cy="90"
        r="7"
        fill="url(#bubbleGrad)"
        stroke="#D8B4FE"
        strokeWidth="1"
      />
      <circle cx="192" cy="176" r="5" fill="#C084FC" opacity="0.7" />

      {/* Leaves */}
      <path
        d="M148 156c6-24 24-42 48-48-2 24-16 44-38 54-8 4-13 1-10-6z"
        fill="url(#leafGradBack)"
      />
      <path
        d="M152 150c14-14 26-24 40-30"
        stroke="#9F7AEA"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M154 172c4-20 18-36 38-42-1 20-13 38-31 46-7 3-9-1-7-4z"
        fill="url(#leafGradFront)"
      />
      <path
        d="M158 168c10-12 20-20 30-26"
        stroke="#7C3AED"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />

      {/* Books stack */}
      <rect x="55" y="176" width="130" height="26" rx="6" fill="#E9D5FF" />
      <rect x="55" y="176" width="130" height="8" rx="4" fill="#D8B4FE" />
      <rect x="68" y="152" width="104" height="26" rx="6" fill="#DDA9F7" />
      <rect x="68" y="152" width="104" height="8" rx="4" fill="#C084FC" />
      <rect
        x="150"
        y="158"
        width="18"
        height="16"
        rx="2"
        fill="#F3E8FF"
        opacity="0.8"
      />

      {/* Graduation cap */}
      <rect
        x="78"
        y="118"
        width="84"
        height="16"
        rx="4"
        fill="#9333EA"
        transform="rotate(-3 120 126)"
      />
      <ellipse cx="120" cy="126" rx="58" ry="16" fill="#A855F7" />
      <path d="M120 126 62 112 120 98 178 112Z" fill="#7C3AED" />
      <circle cx="120" cy="112" r="5" fill="#6D28D9" />
      <path
        d="M178 112v16c0 8-4 8-4 0v-16"
        stroke="#6D28D9"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M120 98v-4a3 3 0 0 1 3-3h3"
        stroke="#6D28D9"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="128" cy="90" r="4" fill="#6D28D9" />

      {/* User plus icon */}
      <circle cx="140" cy="70" r="18" fill="#9333EA" opacity="0.15" />
      <circle cx="140" cy="70" r="12" fill="#9333EA" opacity="0.25" />
      <circle cx="140" cy="70" r="8" fill="#9333EA" opacity="0.4" />
      <UserPlus size={28} x="126" y="56" color="#9333EA" strokeWidth={2} />
    </svg>
  );
}