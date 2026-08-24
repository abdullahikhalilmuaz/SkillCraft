import React from "react";
import { Link } from "react-router-dom";
import "../../styles/contact.css";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  // Facebook,
  // Twitter,
  // Linkedin,
  // Instagram,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@skillcraft.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+1 (555) 123-4567",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "123 Craft Lane, New York, NY",
  },
  {
    icon: Clock,
    title: "Working Hours",
    detail: "Mon – Fri, 9am – 6pm",
  },
];

export default function Contact() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="ct-page">
      {/* Navbar */}
      <header className="ct-navbar">
        <div className="ct-navbar-left">
          <span className="ct-logo-mark">◆</span>
          <span className="ct-logo-text">SkillCraft</span>
        </div>

        <nav className="ct-nav-links">
          <Link to="/" className="ct-nav-link">
            Home
          </Link>
          <Link to="/courses" className="ct-nav-link">
            Courses
          </Link>
          <Link to="/tutors" className="ct-nav-link">
            Tutors
          </Link>
          <Link to="/about" className="ct-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="ct-nav-link ct-nav-link--active">
            Contact
          </Link>
        </nav>

        <div className="ct-navbar-right">
          <Link to="/login" className="ct-btn ct-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="ct-btn ct-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="ct-main">
        {/* Heading */}
        <div className="ct-heading">
          <h1>Get in Touch</h1>
          <p>
            Have a question about a course, your account, or becoming a tutor?
            We&rsquo;d love to hear from you.
          </p>
        </div>

        {/* Contact info cards */}
        <div className="ct-info-grid">
          {contactInfo.map(({ icon: Icon, title, detail }) => (
            <div className="ct-info-card" key={title}>
              <div className="ct-info-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="ct-info-title">{title}</p>
                <p className="ct-info-detail">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form + illustration */}
        <div className="ct-body-grid">
          <div className="ct-panel">
            <h2>Send us a message</h2>

            {submitted ? (
              <div className="ct-success">
                <p className="ct-success-title">Message sent!</p>
                <p className="ct-success-text">
                  Thanks for reaching out — our team will get back to you within
                  one business day.
                </p>
                <button
                  className="ct-btn ct-btn--outline"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="ct-form" onSubmit={handleSubmit}>
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange("name")}
                      required
                    />
                  </div>
                  <div className="ct-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange("email")}
                      required
                    />
                  </div>
                </div>

                <div className="ct-field">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={handleChange("subject")}
                    required
                  />
                </div>

                <div className="ct-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us more..."
                    value={form.message}
                    onChange={handleChange("message")}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="ct-btn ct-btn--primary ct-submit-btn"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="ct-side">
            <div className="ct-side-card">
              <h3>Follow Us</h3>
              <p>Stay updated with new courses, tips, and community stories.</p>
              <div className="ct-social-row">
                <a href="#" aria-label="Facebook" className="ct-social-btn">
                  {/* <Facebook size={16} /> */}
                </a>
                <a href="#" aria-label="Twitter" className="ct-social-btn">
                  {/* <Twitter size={16} /> */}
                </a>
                <a href="#" aria-label="LinkedIn" className="ct-social-btn">
                  {/* <Linkedin size={16} /> */}
                </a>
                <a href="#" aria-label="Instagram" className="ct-social-btn">
                  {/* <Instagram size={16} /> */}
                </a>
              </div>
            </div>

            <div className="ct-side-card ct-map-card">
              <h3>Our Location</h3>
              <div className="ct-map-placeholder">
                <MapPin size={28} />
                <span>123 Craft Lane, New York, NY</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
