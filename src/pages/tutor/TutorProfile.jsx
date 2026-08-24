import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/tutorprofile.css";
import {
  Star,
  Users,
  BookOpen,
  Award,
  MapPin,
  MessageCircle,
} from "lucide-react";
import api from "../../services/api";

export default function TutorProfile() {
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/tutors/${tutorId}`);
        setTutor(response.data.tutor);
        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch tutor:", err);
        setError(
          err.response?.data?.message || "Failed to load tutor profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchTutor();
    }
  }, [tutorId]);

  if (loading)
    return (
      <div className="tp-page">
        <p>Loading tutor profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="tp-page">
        <p>{error}</p>
      </div>
    );

  if (!tutor)
    return (
      <div className="tp-page">
        <p>Tutor not found.</p>
      </div>
    );

  const stats = [
    { icon: BookOpen, value: courses.length, label: "Courses" },
    { icon: Users, value: "0", label: "Students" },
    { icon: Star, value: "0.0", label: "Rating" },
    { icon: Award, value: "0", label: "Years Experience" },
  ];

  return (
    <div className="tp-page">
      {/* Navbar */}
      <header className="tp-navbar">
        <div className="tp-navbar-left">
          <span className="tp-logo-mark">◆</span>
          <span className="tp-logo-text">SkillCraft</span>
        </div>

        <nav className="tp-nav-links">
          <Link to="/" className="tp-nav-link">
            Home
          </Link>
          <Link to="/courses" className="tp-nav-link">
            Courses
          </Link>
          <Link to="/tutors" className="tp-nav-link tp-nav-link--active">
            Tutors
          </Link>
          <Link to="/about" className="tp-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="tp-nav-link">
            Contact
          </Link>
        </nav>

        <div className="tp-navbar-right">
          <Link to="/login" className="tp-btn tp-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="tp-btn tp-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="tp-main">
        {/* Breadcrumb */}
        <div className="tp-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/courses">Tutors</Link>
          <span>/</span>
          <span className="tp-breadcrumb-current">{tutor.name}</span>
        </div>

        {/* Hero */}
        <section className="tp-hero">
          <img
            src={
              tutor.avatar ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop"
            }
            alt={tutor.name}
            className="tp-hero-avatar"
          />
          <div className="tp-hero-info">
            <h1>{tutor.name}</h1>
            <p className="tp-hero-role">Tutor</p>
            <p className="tp-hero-location">
              <MapPin size={14} />
              {tutor.country || "Location not specified"}
            </p>
            <p className="tp-hero-bio">
              {tutor.bio ||
                "Passionate about teaching and helping students achieve their learning goals."}
            </p>
            <div className="tp-hero-socials">
              <a href="#" aria-label="Facebook" className="tp-social-btn">
                {/* <Facebook size={15} /> */}
              </a>
              <a href="#" aria-label="Twitter" className="tp-social-btn">
                {/* <Twitter size={15} /> */}
              </a>
              <a href="#" aria-label="LinkedIn" className="tp-social-btn">
                {/* <Linkedin size={15} /> */}
              </a>
            </div>
          </div>
          <button className="tp-btn tp-btn--primary tp-message-btn">
            <MessageCircle size={16} />
            Message Tutor
          </button>
        </section>

        {/* Stats */}
        <section className="tp-stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="tp-stat-card" key={label}>
              <div className="tp-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="tp-stat-value">{value}</p>
                <p className="tp-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Courses */}
        <section className="tp-section">
          <h2>Courses by {tutor.name}</h2>
          <div className="tp-course-grid">
            {courses.length === 0 ? (
              <p>No courses available yet.</p>
            ) : (
              courses.map((course) => (
                <Link
                  to={`/courses/${course._id}`}
                  className="tp-course-card"
                  key={course._id}
                >
                  <img
                    src={
                      course.image ||
                      "https://picsum.photos/seed/default/200/200"
                    }
                    alt={course.title}
                  />
                  <div className="tp-course-body">
                    <p className="tp-course-title">{course.title}</p>
                    <p className="tp-course-students">
                      {course.students || 0} Students
                    </p>
                    <div className="tp-course-footer">
                      <span className="tp-course-rating">
                        <Star size={13} className="tp-star-icon" />
                        {course.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="tp-course-price">Free</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="tp-section">
          <h2>Student Reviews</h2>
          <div className="tp-reviews-list">
            <p>No reviews yet.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
