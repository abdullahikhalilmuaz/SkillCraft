import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/mycourses.css";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
} from "lucide-react";
import api from "../../services/api";

const summary = [
  { icon: BookOpen, value: "4", label: "Enrolled Courses" },
  { icon: CheckCircle2, value: "2", label: "Completed Courses" },
  { icon: Clock, value: "18", label: "Hours Spent" },
  { icon: Award, value: "3", label: "Certificates Earned" },
];

const tabs = ["My Courses", "Wishlist", "Certificates", "Achievements"];

export default function MyCourses() {
  const [activeTab, setActiveTab] = React.useState("My Courses");
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/learning/my-courses");
        const enrollments = response.data.enrollments || [];

        const formattedCourses = enrollments.map((enrollment) => ({
          id: enrollment.course?._id || enrollment.course?.id,
          title: enrollment.course?.title || "Untitled Course",
          tutor: enrollment.course?.instructor?.name || "Tutor",
          progress: enrollment.progress || 0,
          image:
            enrollment.course?.image ||
            "https://picsum.photos/seed/default/200/200",
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="mc-page">
      {/* Navbar */}
      <header className="mc-navbar">
        <div className="mc-navbar-left">
          <span className="mc-logo-mark">◆</span>
          <span className="mc-logo-text">SkillCraft</span>
        </div>

        <nav className="mc-nav-links">
          <Link to="/" className="mc-nav-link mc-nav-link--active">
            Home
          </Link>
          <Link to="/courses" className="mc-nav-link">
            Courses
          </Link>
          <Link to="/tutors" className="mc-nav-link">
            Tutors
          </Link>
          <Link to="/about" className="mc-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="mc-nav-link">
            Contact
          </Link>
        </nav>

        <div className="mc-navbar-right">
          <button className="mc-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/login" className="mc-btn mc-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="mc-btn mc-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="mc-main">
        {/* Page heading + breadcrumb */}
        <div className="mc-heading">
          <h1>My Learning</h1>
          <div className="mc-breadcrumb">
            <Link to="/student/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <span>My Learning</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mc-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`mc-tab ${activeTab === tab ? "mc-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mc-tabs-divider" />

        {/* Body: courses + sidebar */}
        <div className="mc-body-grid">
          <div className="mc-courses-col">
            {/* Search + sort */}
            <div className="mc-toolbar">
              <div className="mc-search">
                <Search size={16} className="mc-search-icon" />
                <input type="text" placeholder="Search my courses..." />
              </div>
              <div className="mc-sort">
                <span>Sort by: Recent</span>
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Course list */}
            {loading ? (
              <p className="mc-empty">Loading your courses...</p>
            ) : error ? (
              <p className="mc-empty">{error}</p>
            ) : (
              <ul className="mc-course-list">
                {courses.map((course) => (
                  <li className="mc-course-card" key={course.id}>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="mc-course-thumb"
                    />
                    <div className="mc-course-info">
                      <p className="mc-course-title">{course.title}</p>
                      <p className="mc-course-tutor">{course.tutor}</p>
                      <div className="mc-progress-row">
                        <div className="mc-progress-track">
                          <div
                            className="mc-progress-fill"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="mc-progress-label">
                          {course.progress}% Complete
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/student/learn/${course.id}/1`}
                      className="mc-btn mc-btn--primary mc-continue-btn"
                    >
                      Continue
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar */}
          <div className="mc-sidebar-col">
            <div className="mc-panel">
              <h2 className="mc-panel-title">Learning Summary</h2>
              <ul className="mc-summary-list">
                {summary.map(({ icon: Icon, value, label }) => (
                  <li className="mc-summary-item" key={label}>
                    <span className="mc-summary-icon">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="mc-summary-value">{value}</p>
                      <p className="mc-summary-label">{label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mc-panel mc-keep-learning">
              <h2 className="mc-panel-title">Keep Learning!</h2>
              <p className="mc-keep-learning-text">
                Complete your courses and earn certificates to boost your
                skills.
              </p>
              <div className="mc-keep-learning-art" aria-hidden="true">
                <GraduationCap size={56} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
