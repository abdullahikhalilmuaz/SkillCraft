import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Search,
  PlayCircle,
  Star,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Award,
  Infinity as InfinityIcon,
  Smartphone,
  Heart,
  //   Facebook,
  //   Twitter,
  //   Linkedin,
  Link2,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";
import { isAuthenticated } from "../services/authService";
import "../styles/coursedetails.css";

const TABS = ["Overview", "Curriculum", "Instructor", "Reviews"];

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMessage, setEnrollMessage] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data.course);
        setActiveImage(response.data.course?.image || "");
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load course. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    setEnrollMessage("");

    try {
      const response = await api.post(`/learning/enroll/${courseId}`);
      setEnrollMessage(response.data.message || "Successfully enrolled!");
      setTimeout(() => {
        setEnrollMessage("");
      }, 3000);
    } catch (err) {
      console.error("Enrollment failed:", err);
      setEnrollMessage(
        err.response?.data?.message || "Failed to enroll. Please try again.",
      );
      setTimeout(() => {
        setEnrollMessage("");
      }, 3000);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading)
    return (
      <div className="cd-page">
        <p>Loading course...</p>
      </div>
    );
  if (error)
    return (
      <div className="cd-page">
        <p>{error}</p>
      </div>
    );
  if (!course)
    return (
      <div className="cd-page">
        <p>Course not found.</p>
      </div>
    );

  const gallery = [course.image, ...(course.gallery || [])].filter(Boolean);
  const displayImage =
    activeImage || course.image || "https://picsum.photos/seed/course/700/500";

  return (
    <div className="cd-page">
      {/* Navbar */}
      <header className="cd-nav">
        <Link to="/" className="cd-nav__brand">
          <LogoMark />
          <span>SkillCraft</span>
        </Link>

        <nav className="cd-nav__links">
          <Link to="/" className="cd-nav__link">
            Home
          </Link>
          <Link to="/courses" className="cd-nav__link cd-nav__link--active">
            Courses
          </Link>
          <Link to="/tutors" className="cd-nav__link">
            Tutors
          </Link>
          <Link to="/about" className="cd-nav__link">
            About Us
          </Link>
          <Link to="/contact" className="cd-nav__link">
            Contact
          </Link>
        </nav>

        <div className="cd-nav__actions">
          <button className="cd-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/login" className="cd-btn cd-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="cd-btn cd-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <div className="cd-body">
        {/* Breadcrumb */}
        <p className="cd-breadcrumb">
          <Link to="/student/dashboard">Dashboard</Link> <span>›</span>{" "}
          <Link to="/courses">Courses</Link> <span>›</span>{" "}
          <span>{course.title}</span>
        </p>

        {/* Enroll message */}
        {enrollMessage && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: enrollMessage.includes("Success")
                ? "#f0fdf4"
                : "#fef2f2",
              color: enrollMessage.includes("Success") ? "#15803d" : "#b91c1c",
              fontSize: "14px",
            }}
          >
            {enrollMessage}
          </div>
        )}

        <div className="cd-layout">
          {/* Left: gallery + tabs */}
          <div className="cd-main">
            <div className="cd-gallery">
              <div className="cd-gallery__hero">
                <img src={displayImage} alt={course.title} />
                {gallery.length > 0 && (
                  <button
                    className="cd-gallery__play"
                    aria-label="Play preview video"
                  >
                    <PlayCircle size={54} />
                  </button>
                )}
              </div>

              <div className="cd-gallery__thumbs">
                {gallery.slice(1, 5).map((src, i) => (
                  <button
                    key={i}
                    className={`cd-gallery__thumb ${activeImage === src ? "cd-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveImage(src)}
                  >
                    <img src={src} alt={`${course.title} preview ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="cd-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`cd-tabs__item ${activeTab === tab ? "cd-tabs__item--active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Reviews" && ` (${course.reviews || 0})`}
                </button>
              ))}
            </div>

            <div className="cd-tab-panel">
              {activeTab === "Overview" && (
                <div>
                  <h2>About This Course</h2>
                  <p className="cd-tab-panel__lead">{course.description}</p>
                  <ul className="cd-checklist">
                    {course.aboutBullets?.map((bullet) => (
                      <li key={bullet}>
                        <CheckCircle2 size={16} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "Curriculum" && (
                <div>
                  <h2>Course Curriculum</h2>
                  <ul className="cd-curriculum">
                    {course.curriculum?.map((section) => (
                      <li key={section.section}>
                        <span className="cd-curriculum__name">
                          {section.section}
                        </span>
                        <span className="cd-curriculum__meta">
                          {section.lessons} lessons · {section.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "Instructor" && (
                <div className="cd-instructor-panel">
                  <span className="cd-avatar cd-avatar--lg">
                    {course.instructor?.name?.charAt(0) || "T"}
                  </span>
                  <div>
                    <h2>{course.instructor?.name || "Tutor"}</h2>
                    <p className="cd-tab-panel__lead">
                      {course.instructor?.title || "Course Instructor"}
                    </p>
                    <p>
                      {course.instructor?.bio ||
                        "Experienced instructor teaching this course."}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div>
                  <h2>Student Reviews</h2>
                  <p className="cd-tab-panel__lead">
                    {course.rating?.toFixed(1) || "0.0"} average rating from{" "}
                    {course.reviews || 0} reviews.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: purchase card + includes + share */}
          <aside className="cd-sidebar">
            <div className="cd-purchase-card">
              <span className="cd-tag">{course.category}</span>
              <h1 className="cd-title">{course.title}</h1>

              <div className="cd-instructor-row">
                <span className="cd-avatar">
                  {course.instructor?.name?.charAt(0) || "T"}
                </span>
                <div>
                  <p className="cd-instructor-row__name">
                    {course.instructor?.name || "Tutor"}
                  </p>
                  <p className="cd-instructor-row__title">
                    {course.instructor?.title || "Course Instructor"}
                  </p>
                </div>
              </div>

              <div className="cd-meta-row">
                <span className="cd-meta-row__rating">
                  <Star size={14} fill="#FACC15" stroke="#FACC15" />
                  {course.rating?.toFixed(1) || "0.0"}{" "}
                  <span className="cd-meta-row__muted">
                    ({course.reviews || 0} Reviews)
                  </span>
                </span>
                <span className="cd-meta-row__students">
                  <Users size={14} />
                  {course.students?.toLocaleString() || 0} Students
                </span>
              </div>

              <p className="cd-price">${course.price?.toFixed(2) || "0.00"}</p>
              <p className="cd-description">{course.description}</p>

              <div className="cd-quick-facts">
                <span>
                  <BookOpen size={14} /> {course.lessons || 0} Lessons
                </span>
                <span>
                  <HelpCircle size={14} /> {course.quizzes || 0} Quizzes
                </span>
                <span>
                  <Award size={14} /> Certificate
                </span>
                <span>
                  <InfinityIcon size={14} /> Lifetime Access
                </span>
              </div>

              <div className="cd-cta-row">
                <button
                  className="cd-btn cd-btn--primary cd-btn--full"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
                <button className="cd-btn cd-btn--outline cd-btn--full">
                  <Heart size={16} /> Add to Wishlist
                </button>
              </div>
            </div>

            <div className="cd-side-card">
              <h3>Course Includes</h3>
              <ul className="cd-includes-list">
                {course.includes?.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cd-side-card">
              <h3>Share this course</h3>
              <div className="cd-share-row">
                <button className="cd-share-btn" aria-label="Share on Facebook">
                  {/* <Facebook size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Share on Twitter">
                  {/* <Twitter size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Share on LinkedIn">
                  {/* <Linkedin size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Copy link">
                  <Link2 size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

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
