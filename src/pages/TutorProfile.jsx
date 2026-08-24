import React from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/tutorprofile.css";
import {
  Star,
  Users,
  BookOpen,
  Award,
  MapPin,
  MessageCircle,
  // Facebook,
  // Twitter,
  // Linkedin,
} from "lucide-react";

const stats = [
  { icon: BookOpen, value: "12", label: "Courses" },
  { icon: Users, value: "350", label: "Students" },
  { icon: Star, value: "4.8", label: "Rating" },
  { icon: Award, value: "8", label: "Years Experience" },
];

const courses = [
  {
    id: "cream-making-masterclass",
    title: "Beginner Cream Making Masterclass",
    students: "1,245 Students",
    rating: "4.9",
    price: "$49.99",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
  },
  {
    id: "advanced-soap-making",
    title: "Advanced Soap Making Advanced",
    students: "312 Students",
    rating: "4.6",
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=200&h=200&fit=crop",
  },
  {
    id: "luxury-body-butter-masterclass",
    title: "Luxury Body Butter Masterclass",
    students: "540 Students",
    rating: "4.8",
    price: "$49.99",
    image:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=200&h=200&fit=crop",
  },
];

const reviews = [
  {
    name: "Jessica Brown",
    rating: 5,
    text: "Sarah explains every step so clearly. I went from knowing nothing about cream making to selling my own products.",
    time: "2 days ago",
  },
  {
    name: "Alex Wilson",
    rating: 5,
    text: "Great course structure and Sarah responds to questions quickly. Highly recommend for beginners.",
    time: "1 week ago",
  },
  {
    name: "Emily Davis",
    rating: 4,
    text: "Solid fundamentals course. Would love to see more advanced follow-up content.",
    time: "3 weeks ago",
  },
];

export default function TutorProfile() {
  const { tutorId } = useParams();

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
          <span className="tp-breadcrumb-current">Sarah Johnson</span>
        </div>

        {/* Hero */}
        <section className="tp-hero">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop"
            alt="Sarah Johnson"
            className="tp-hero-avatar"
          />
          <div className="tp-hero-info">
            <h1>Sarah Johnson</h1>
            <p className="tp-hero-role">Expert Cream Formulator</p>
            <p className="tp-hero-location">
              <MapPin size={14} />
              New York, USA
            </p>
            <p className="tp-hero-bio">
              Passionate about teaching and helping students achieve their
              learning goals. 8+ years of hands-on experience formulating
              skincare products for independent brands.
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
          <h2>Courses by Sarah Johnson</h2>
          <div className="tp-course-grid">
            {courses.map((course) => (
              <Link
                to={`/courses/${course.id}`}
                className="tp-course-card"
                key={course.id}
              >
                <img src={course.image} alt={course.title} />
                <div className="tp-course-body">
                  <p className="tp-course-title">{course.title}</p>
                  <p className="tp-course-students">{course.students}</p>
                  <div className="tp-course-footer">
                    <span className="tp-course-rating">
                      <Star size={13} className="tp-star-icon" />
                      {course.rating}
                    </span>
                    <span className="tp-course-price">{course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="tp-section">
          <h2>Student Reviews</h2>
          <div className="tp-reviews-list">
            {reviews.map((review) => (
              <div className="tp-review-card" key={review.name}>
                <div className="tp-review-header">
                  <div className="tp-review-avatar">
                    {review.name.charAt(0)}
                  </div>
                  <div className="tp-review-meta">
                    <p className="tp-review-name">{review.name}</p>
                    <div className="tp-review-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < review.rating
                              ? "tp-star-icon tp-star-icon--filled"
                              : "tp-star-icon"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="tp-review-time">{review.time}</span>
                </div>
                <p className="tp-review-text">{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
