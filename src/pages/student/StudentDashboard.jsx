import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/studentdashboard.css";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Award,
  Heart,
  HelpCircle,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Clock,
  CheckCircle2,
  Star,
  Menu,
  X,
} from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/student/dashboard",
    active: true,
  },
  { icon: BookOpen, label: "My Learning", path: "/student/courses" },
  { icon: GraduationCap, label: "Courses", path: "/courses" },
  { icon: ClipboardCheck, label: "Quizzes", path: "/student/quizzes" },
  { icon: Award, label: "Certificates", path: "/student/certificates" },
  { icon: Heart, label: "Wishlist", path: "/student/wishlist" },
];

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState("Student");
  const [stats, setStats] = useState([
    { icon: BookOpen, value: "0", label: "Courses Enrolled" },
    { icon: CheckCircle2, value: "0", label: "Courses Completed" },
    { icon: Award, value: "0", label: "Certificates" },
    { icon: Clock, value: "0h", label: "Learning Hours" },
  ]);
  const [continueCourse, setContinueCourse] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDataSaved = localStorage.getItem("user");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        if (user) setStudentName(user.name || "Student");

        // Fetch enrolled courses
        const enrollResponse = await api.get("/learning/my-courses");
        const enrollments = enrollResponse.data.enrollments || [];

        // Calculate stats
        const enrolled = enrollments.length;
        const completed = enrollments.filter((e) => e.completed).length;
        const totalHours = enrollments.reduce(
          (sum, e) => sum + (e.timeSpent || 0),
          0,
        );
        const hoursDisplay =
          totalHours > 60
            ? `${Math.round(totalHours / 60)}h`
            : `${totalHours}h`;

        setStats([
          {
            icon: BookOpen,
            value: String(enrolled),
            label: "Courses Enrolled",
          },
          {
            icon: CheckCircle2,
            value: String(completed),
            label: "Courses Completed",
          },
          { icon: Award, value: "0", label: "Certificates" },
          { icon: Clock, value: hoursDisplay || "0h", label: "Learning Hours" },
        ]);

        // Find course with most progress to continue
        if (enrollments.length > 0) {
          const sorted = [...enrollments].sort(
            (a, b) => b.progress - a.progress,
          );
          const top = sorted[0];
          if (top && top.course) {
            setContinueCourse({
              id: top.course._id || top.course.id,
              title: top.course.title,
              tutor: top.course.instructor?.name || "Tutor",
              image:
                top.course.image ||
                "https://picsum.photos/seed/default/200/200",
              progress: top.progress || 0,
            });
          }
        }

        // Fetch recommended courses (published courses)
        const courseResponse = await api.get("/courses");
        const courses = courseResponse.data.courses || [];
        setRecommendedCourses(
          courses.slice(0, 4).map((c) => ({
            id: c._id || c.id,
            title: c.title,
            tutor: c.instructor?.name || "Tutor",
            rating: c.rating?.toFixed(1) || "0.0",
            reviews: c.reviews || "0",
            price: "$0.00",
            image: c.image || "https://picsum.photos/seed/default/200/200",
            category: c.category || "Course",
          })),
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Use fallback data
        setRecommendedCourses([
          {
            id: "advanced-cream-formulation",
            title: "Advanced Cream Formulation",
            tutor: "Sarah Johnson",
            rating: "4.9",
            reviews: "120",
            price: "$59.99",
            image:
              "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
            category: "Cream Making",
          },
          {
            id: "herbal-soap-making-advanced",
            title: "Herbal Soap Making Advanced",
            tutor: "Michael Brown",
            rating: "4.7",
            reviews: "98",
            price: "$39.99",
            image:
              "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&h=200&fit=crop",
            category: "Soap Making",
          },
          {
            id: "advanced-perfume-blending",
            title: "Advanced Perfume Blending",
            tutor: "Emma Davis",
            rating: "4.9",
            reviews: "150",
            price: "$69.99",
            image:
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
            category: "Perfume Making",
          },
          {
            id: "luxury-body-butter-masterclass",
            title: "Luxury Body Butter Masterclass",
            tutor: "Sarah Johnson",
            rating: "4.8",
            reviews: "110",
            price: "$49.99",
            image:
              "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=200&h=200&fit=crop",
            category: "Cream Making",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="sd-page">
      {/* Mobile Menu Toggle */}
      <button
        className="sd-mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`sd-sidebar ${mobileMenuOpen ? "sd-sidebar--open" : ""}`}
      >
        <div className="sd-sidebar-logo">
          <span className="sd-logo-mark">◆</span>
          <span className="sd-logo-text">SkillCraft</span>
        </div>

        <nav className="sd-sidebar-nav">
          {navItems.map(({ icon: Icon, label, path, active }) => (
            <Link
              to={path}
              key={label}
              className={`sd-nav-item ${active ? "sd-nav-item--active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sd-sidebar-bottom">
          <Link to="/student/profile" className="sd-nav-item">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </Link>
          <Link to="/student/profile" className="sd-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <div className="sd-mini-profile">
            <img
              src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
              alt="Student avatar"
              className="sd-mini-avatar"
            />
            <div>
              <p className="sd-mini-name">{studentName}</p>
              <p className="sd-mini-role">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="sd-content">
        {/* Topbar */}
        <header className="sd-topbar">
          <div className="sd-topbar-spacer" />
          <div className="sd-topbar-right">
            <button className="sd-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="sd-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="sd-notif-dot" />
            </button>
            <Link to="/student/profile" className="sd-user-chip">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
                alt="Student avatar"
                className="sd-user-avatar"
              />
              <span className="sd-user-name">{studentName}</span>
              <ChevronDown size={16} />
            </Link>
          </div>
        </header>

        <main className="sd-main">
          {/* Welcome hero */}
          <section className="sd-hero">
            <div className="sd-hero-text">
              <h1>Good afternoon, {studentName} 👋</h1>
              <p className="sd-hero-subtitle">Ready to continue learning?</p>
              <p className="sd-hero-description">
                Continue your journey and build new practical skills.
              </p>
              <Link to="/student/courses" className="sd-btn sd-btn--white">
                Continue Learning
              </Link>
            </div>
            <div className="sd-hero-art" aria-hidden="true">
              <div className="sd-hero-blob" />
              <GraduationCap
                size={72}
                strokeWidth={1.2}
                className="sd-hero-icon"
              />
            </div>
          </section>

          {/* Stats */}
          <section className="sd-stats">
            {stats.map(({ icon: Icon, value, label }) => (
              <div className="sd-stat-card" key={label}>
                <div className="sd-stat-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="sd-stat-value">{value}</p>
                  <p className="sd-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Continue Learning */}
          {continueCourse && (
            <section className="sd-section">
              <div className="sd-section-header">
                <h2>Continue Learning</h2>
                <Link to="/student/courses" className="sd-view-all">
                  View All →
                </Link>
              </div>

              <div className="sd-continue-card">
                <img
                  src={continueCourse.image}
                  alt={continueCourse.title}
                  className="sd-continue-thumb"
                />
                <div className="sd-continue-info">
                  <p className="sd-continue-title">{continueCourse.title}</p>
                  <p className="sd-continue-tutor">{continueCourse.tutor}</p>
                  <div className="sd-progress-row">
                    <div className="sd-progress-track">
                      <div
                        className="sd-progress-fill"
                        style={{ width: `${continueCourse.progress}%` }}
                      />
                    </div>
                    <span className="sd-progress-label">
                      {continueCourse.progress}% Complete
                    </span>
                  </div>
                </div>
                <Link
                  to={`/student/learn/${continueCourse.id}/1`}
                  className="sd-btn sd-btn--primary sd-continue-btn"
                >
                  Resume Course
                </Link>
              </div>
            </section>
          )}

          {/* Recommended courses */}
          <section className="sd-section">
            <div className="sd-section-header">
              <h2>Recommended For You</h2>
              <Link to="/courses" className="sd-view-all">
                View All →
              </Link>
            </div>

            <div className="sd-course-grid">
              {recommendedCourses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  className="sd-course-card"
                  key={course.id}
                >
                  <div className="sd-course-image-wrap">
                    <img src={course.image} alt={course.title} />
                    <span className="sd-course-badge">{course.category}</span>
                  </div>
                  <div className="sd-course-body">
                    <p className="sd-course-title">{course.title}</p>
                    <p className="sd-course-tutor">{course.tutor}</p>
                    <div className="sd-course-footer">
                      <span className="sd-course-rating">
                        <Star size={13} className="sd-star-icon" />
                        {course.rating} ({course.reviews})
                      </span>
                      <span className="sd-course-price">{course.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
