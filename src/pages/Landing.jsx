import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Users,
  ThumbsUp,
  ShieldCheck,
  Droplet,
  Package,
  FlaskConical,
} from "lucide-react";
import "../styles/landing.css";

const STATS = [
  { icon: BookOpen, value: "500+", label: "Courses" },
  { icon: Users, value: "200+", label: "Expert Tutors" },
  { icon: ThumbsUp, value: "10K+", label: "Happy Students" },
  { icon: ShieldCheck, value: "95%", label: "Success Rate" },
];

const CATEGORIES = [
  {
    icon: Droplet,
    title: "Cream Making",
    description:
      "Learn to make different types of creams for skin and body care.",
  },
  {
    icon: Package,
    title: "Soap Making",
    description: "Mastering the art of soap making with various techniques.",
  },
  {
    icon: FlaskConical,
    title: "Perfume Making",
    description: "Create long-lasting fragrances and become a perfume expert.",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <header className="landing-nav">
        <Link to="/" className="landing-nav__brand">
          <LogoMark />
          <span>SkillCraft</span>
        </Link>

        <nav className="landing-nav__links">
          <Link to="/" className="landing-nav__link landing-nav__link--active">
            Home
          </Link>
          <Link to="/courses" className="landing-nav__link">
            Courses
          </Link>
          <Link to="/tutors" className="landing-nav__link">
            Tutors
          </Link>
          <Link to="/about" className="landing-nav__link">
            About Us
          </Link>
          <Link to="/contact" className="landing-nav__link">
            Contact
          </Link>
        </nav>

        <div className="landing-nav__actions">
          <Link to="/login" className="landing-btn landing-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="landing-btn landing-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-badge">
            <Sparkles size={14} />
            AI-Powered Learning
          </span>

          <h1 className="landing-hero__title">
            Learn Cream, Soap &amp; Perfume Making
            <br />
            From{" "}
            <span className="landing-hero__title-accent">Expert Tutors</span>
          </h1>

          <p className="landing-hero__subtitle">
            An AI-based learning platform for skills acquisition. Learn at your
            own pace, take quizzes, track your progress and get personalized
            recommendations.
          </p>

          <div className="landing-hero__actions">
            <Link
              to="/courses"
              className="landing-btn landing-btn--primary landing-btn--lg"
            >
              Explore Courses
            </Link>
            <Link
              to="/register?role=tutor"
              className="landing-btn landing-btn--outline landing-btn--lg"
            >
              Become a Tutor
            </Link>
          </div>

          <div className="landing-ai-callout">
            <span className="landing-ai-callout__icon">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="landing-ai-callout__title">
                AI Assistance &amp; Recommendations
              </p>
              <p className="landing-ai-callout__text">
                Get instant help and course picks tailored to your skill level
                and goals.
              </p>
            </div>
          </div>
        </div>

        <div className="landing-hero__art">
          <HeroIllustration />
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stats">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div className="landing-stats__item" key={label}>
            <span className="landing-stats__icon">
              <Icon size={20} />
            </span>
            <div>
              <p className="landing-stats__value">{value}</p>
              <p className="landing-stats__label">{label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Popular Categories */}
      <section className="landing-categories">
        <h2 className="landing-categories__title">Popular Categories</h2>

        <div className="landing-categories__grid">
          {CATEGORIES.map(({ icon: Icon, title, description }) => (
            <div className="landing-category-card" key={title}>
              <span className="landing-category-card__icon">
                <Icon size={22} />
              </span>
              <h3 className="landing-category-card__title">{title}</h3>
              <p className="landing-category-card__desc">{description}</p>
              <Link
                to="/courses"
                className="landing-btn landing-btn--primary landing-btn--sm"
              >
                Explore
              </Link>
            </div>
          ))}
        </div>
      </section>
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

/* Original illustration inspired by the mockup's product-on-pedestal hero
   art: cosmetic bottles on a podium with leaf accents. Drawn from scratch
   as SVG, not a copy of any stock asset. */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="landing-hero__svg"
    >
      <defs>
        <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3E8FF" />
          <stop offset="100%" stopColor="#D8B4FE" />
        </linearGradient>
        <linearGradient id="bottlePink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0ABFC" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>
        <linearGradient id="bottlePurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
        <linearGradient id="bottleCream" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF4FF" />
          <stop offset="100%" stopColor="#F0D9FF" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#B794F4" />
        </linearGradient>
        <radialGradient id="glowSoft" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#F3E8FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F3E8FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="240" cy="190" r="180" fill="url(#glowSoft)" />

      {/* leaves */}
      <path
        d="M60 260c40-10 66-42 72-88-40 4-74 30-86 66-6 12 0 24 14 22z"
        fill="url(#leafGrad)"
        opacity="0.85"
      />
      <path
        d="M420 240c-36-8-62-36-70-78 36 2 66 26 78 60 6 12 0 22-8 18z"
        fill="url(#leafGrad)"
        opacity="0.85"
      />

      {/* pedestal */}
      <ellipse cx="240" cy="360" rx="150" ry="26" fill="url(#pedestalGrad)" />
      <path
        d="M110 340h260l-16 40a20 20 0 0 1-19 15H145a20 20 0 0 1-19-15z"
        fill="url(#pedestalGrad)"
      />

      {/* lotion bottle (tall, cream, pump) */}
      <rect
        x="255"
        y="150"
        width="60"
        height="150"
        rx="16"
        fill="url(#bottleCream)"
      />
      <rect x="270" y="110" width="30" height="45" rx="6" fill="#E9D5FF" />
      <rect x="278" y="80" width="14" height="35" rx="5" fill="#D8B4FE" />
      <circle cx="285" cy="76" r="8" fill="#F0ABFC" />

      {/* pink pump bottle */}
      <rect
        x="185"
        y="175"
        width="52"
        height="120"
        rx="14"
        fill="url(#bottlePink)"
      />
      <rect x="197" y="145" width="28" height="34" rx="6" fill="#D946EF" />
      <rect x="204" y="120" width="14" height="30" rx="5" fill="#C026D3" />
      <circle cx="211" cy="116" r="7" fill="#F0ABFC" />

      {/* cream jar */}
      <rect
        x="150"
        y="255"
        width="58"
        height="42"
        rx="10"
        fill="url(#bottlePurple)"
      />
      <ellipse cx="179" cy="255" rx="29" ry="9" fill="#F3E8FF" />
      <ellipse cx="179" cy="252" rx="24" ry="6" fill="#FFFFFF" />

      {/* dropper bottle */}
      <rect x="245" y="235" width="34" height="62" rx="8" fill="#7C3AED" />
      <rect x="253" y="212" width="18" height="26" rx="4" fill="#6D28D9" />
      <circle cx="262" cy="208" r="6" fill="#5B21B6" />

      {/* small round pot */}
      <circle cx="315" cy="278" r="20" fill="#F0ABFC" />
      <ellipse cx="315" cy="264" rx="16" ry="5" fill="#FDE8FF" />

      {/* perfume bottle */}
      <rect
        x="340"
        y="228"
        width="46"
        height="60"
        rx="8"
        fill="url(#bottlePurple)"
        opacity="0.92"
      />
      <rect x="352" y="205" width="22" height="26" rx="5" fill="#C084FC" />
      <rect x="358" y="192" width="10" height="16" rx="3" fill="#EAB308" />

      {/* sparkle accents */}
      <path
        d="M410 130l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"
        fill="#F0ABFC"
        opacity="0.8"
      />
      <path
        d="M60 150l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"
        fill="#D8B4FE"
        opacity="0.8"
      />
    </svg>
  );
}
