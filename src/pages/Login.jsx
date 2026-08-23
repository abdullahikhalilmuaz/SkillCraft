import { login } from "../services/authService";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.password) next.password = "Password is required";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) return;

    setSubmitting(true);

    try {
      const data = await login(form.email, form.password);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "tutor") {
        navigate("/tutor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Login failed. Please check your email and password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <Link to="/" className="login-header__brand">
          <LogoMark />
          <span className="login-header__brand-name">SkillCraft</span>
        </Link>
        <Link to="/" className="login-header__home">
          Home
        </Link>
      </header>

      {/* Main */}
      <main className="login-main">
        <div className="login-card">
          {/* Left panel */}
          <div className="login-illustration-panel">
            <BackgroundBlobs />

            <div className="login-illustration-panel__intro">
              <h2 className="login-illustration-panel__title">Welcome Back!</h2>
              <p className="login-illustration-panel__subtitle">
                Login to continue your learning journey with SkillCraft.
              </p>
            </div>

            <GradCapIllustration className="login-illustration-panel__art" />
          </div>

          {/* Right panel */}
          <div className="login-form-panel">
            <h1 className="login-form-panel__title">Login to Your Account</h1>

            <form onSubmit={handleSubmit} noValidate className="login-form">
              <div className="login-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`login-input ${errors.email ? "login-input--error" : ""}`}
                />
                {errors.email && (
                  <p className="login-field__error">{errors.email}</p>
                )}
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>
                <div className="login-password-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`login-input ${errors.password ? "login-input--error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="login-password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="login-field__error">{errors.password}</p>
                )}
              </div>

              <div className="login-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="login-forgot-link">
                  Forgot Password?
                </Link>
              </div>
              {errors.submit && (
                <p className="login-field__error">{errors.submit}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="login-submit"
              >
                {submitting ? "Logging in…" : "Login"}
              </button>

              <div className="login-divider">
                <div className="login-divider__line" />
                <span className="login-divider__label">Or continue with</span>
                <div className="login-divider__line" />
              </div>

              <div className="login-social-row">
                <button type="button" className="login-social-btn">
                  <GoogleIcon /> Google
                </button>
                <button type="button" className="login-social-btn">
                  <FacebookIcon /> Facebook
                </button>
              </div>

              <p className="login-signup">
                Don&apos;t have an account?{" "}
                <Link to="/register">Sign up here</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- small presentational bits ---------- */

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
      className="login-illustration-panel__blobs"
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

/* Original illustration inspired by the mockup: a graduation cap resting on
   a stack of books. Drawn from scratch as SVG (not a copy of any stock asset). */
function GradCapIllustration({ className = "" }) {
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

      {/* leaves: back leaf, front leaf, each with a midrib for a more botanical look */}
      <g>
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
      </g>
      <g>
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
      </g>
      <g>
        <path
          d="M150 190c10-16 26-26 44-28-6 18-20 32-38 36-6 1-9-3-6-8z"
          fill="url(#leafGradBack)"
          opacity="0.9"
        />
        <path
          d="M156 188c10-10 20-16 30-18"
          stroke="#9F7AEA"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />
      </g>

      {/* bottom book */}
      <rect x="55" y="176" width="130" height="26" rx="6" fill="#E9D5FF" />
      <rect x="55" y="176" width="130" height="8" rx="4" fill="#D8B4FE" />

      {/* middle book */}
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

      {/* cap board */}
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
    </svg>
  );
}
