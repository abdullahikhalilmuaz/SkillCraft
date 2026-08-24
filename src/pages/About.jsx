import React from "react";
import { Link } from "react-router-dom";
import "../../styles/about.css";
import {
  Sparkles,
  Target,
  Heart,
  Users,
  BookOpen,
  Award,
  Star,
} from "lucide-react";

const stats = [
  { icon: BookOpen, value: "500+", label: "Courses" },
  { icon: Users, value: "200+", label: "Expert Tutors" },
  { icon: Heart, value: "10K+", label: "Happy Students" },
  { icon: Star, value: "95%", label: "Success Rate" },
];

const values = [
  {
    icon: Target,
    title: "Practical Learning",
    description:
      "Every course is built around real, hands-on skills you can use right away — not just theory.",
  },
  {
    icon: Heart,
    title: "Student First",
    description:
      "We design every feature around what helps students actually finish and enjoy their courses.",
  },
  {
    icon: Award,
    title: "Expert Tutors",
    description:
      "Our tutors are working artisans and professionals, not just instructors reading slides.",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & Lead Tutor",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    name: "Michael Brown",
    role: "Head of Curriculum",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    name: "Emma Davis",
    role: "Community Lead",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
  },
];

export default function About() {
  return (
    <div className="ab-page">
      {/* Navbar */}
      <header className="ab-navbar">
        <div className="ab-navbar-left">
          <span className="ab-logo-mark">◆</span>
          <span className="ab-logo-text">SkillCraft</span>
        </div>

        <nav className="ab-nav-links">
          <Link to="/" className="ab-nav-link">Home</Link>
          <Link to="/courses" className="ab-nav-link">Courses</Link>
          <Link to="/tutors" className="ab-nav-link">Tutors</Link>
          <Link to="/about" className="ab-nav-link ab-nav-link--active">About Us</Link>
          <Link to="/contact" className="ab-nav-link">Contact</Link>
        </nav>

        <div className="ab-navbar-right">
          <Link to="/login" className="ab-btn ab-btn--ghost">Login</Link>
          <Link to="/register" className="ab-btn ab-btn--primary">Sign Up</Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="ab-hero">
          <span className="ab-eyebrow">
            <Sparkles size={13} />
            About SkillCraft
          </span>
          <h1 className="ab-hero-title">
            Helping people turn <span className="ab-hero-highlight">curiosity</span>{" "}
            into real, marketable skills.
          </h1>
          <p className="ab-hero-subtitle">
            SkillCraft is an AI-powered learning platform focused on
            cream, soap, and perfume making — built for people who want to
            learn by doing, at their own pace, from tutors who actually
            practice the craft.
          </p>
        </section>

        {/* Stats */}
        <section className="ab-stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="ab-stat-card" key={label}>
              <div className="ab-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="ab-stat-value">{value}</p>
                <p className="ab-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Story */}
        <section className="ab-story">
          <div className="ab-story-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop"
              alt="Cream making workshop"
              className="ab-story-image"
            />
          </div>
          <div className="ab-story-text">
            <span className="ab-section-eyebrow">Our Story</span>
            <h2>Built by makers, for makers</h2>
            <p>
              SkillCraft started as a small workshop teaching cream and soap
              making in person. As demand grew beyond what any single studio
              could hold, we rebuilt that same hands-on teaching style into
              an online platform — with video lessons, quizzes, and
              AI-powered recommendations that adapt to how each student
              learns.
            </p>
            <p>
              Today, thousands of students learn directly from working
              tutors, track their progress course by course, and walk away
              with certificates and skills they can actually use.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="ab-values">
          <div className="ab-section-header">
            <span className="ab-section-eyebrow">What We Believe</span>
            <h2>Our Values</h2>
          </div>
          <div className="ab-values-grid">
            {values.map(({ icon: Icon, title, description }) => (
              <div className="ab-value-card" key={title}>
                <div className="ab-value-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="ab-team">
          <div className="ab-section-header">
            <span className="ab-section-eyebrow">Meet the Team</span>
            <h2>The People Behind SkillCraft</h2>
          </div>
          <div className="ab-team-grid">
            {team.map((member) => (
              <div className="ab-team-card" key={member.name}>
                <img src={member.image} alt={member.name} />
                <p className="ab-team-name">{member.name}</p>
                <p className="ab-team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ab-cta">
          <h2>Ready to start learning?</h2>
          <p>Join thousands of students building real skills with SkillCraft.</p>
          <Link to="/courses" className="ab-btn ab-btn--primary ab-cta-btn">
            Explore Courses
          </Link>
        </section>
      </main>
    </div>
  );
}