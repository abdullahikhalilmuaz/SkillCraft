import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/coursemanagement.css";
import {
  ChevronRight,
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  ClipboardList,
  Users,
  Star,
  DollarSign,
  Bell,
} from "lucide-react";
import api from "../../services/api";

const filterTabs = [
  "All Courses",
  "Published",
  "Drafts",
  "Pending Review",
  "Archived",
];

const statusClassMap = {
  Published: "cm-status--published",
  Draft: "cm-status--draft",
  "Pending Review": "cm-status--pending",
  Archived: "cm-status--archived",
};

export default function CourseManagement() {
  const [activeFilter, setActiveFilter] = React.useState("All Courses");
  const [openMenuId, setOpenMenuId] = React.useState(null);
  const [courses, setCourses] = React.useState([]);
  const [stats, setStats] = React.useState([
    { icon: ClipboardList, value: "0", label: "Total Courses" },
    { icon: Users, value: "0", label: "Total Enrollments" },
    { icon: Star, value: "0.0", label: "Average Rating" },
    { icon: DollarSign, value: "$0.00", label: "Total Earnings" },
  ]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch tutor courses
        const coursesRes = await api.get("/courses/tutor/my-courses");
        const tutorCourses = coursesRes.data.courses || [];

        // Format courses for display
        const formattedCourses = tutorCourses.map((course) => ({
          id: course._id,
          title: course.title,
          updated: new Date(course.updatedAt).toLocaleDateString(),
          enrollments: course.students || "0",
          rating: course.rating?.toFixed(1) || "0.0",
          reviews: course.reviews || "0",
          status: course.published ? "Published" : "Draft",
          image: course.image || "https://picsum.photos/seed/default/200/200",
        }));
        setCourses(formattedCourses);

        // Fetch tutor stats
        const statsRes = await api.get("/courses/tutor/stats");
        const data = statsRes.data.stats;
        setStats([
          {
            icon: ClipboardList,
            value: String(data.totalCourses || 0),
            label: "Total Courses",
          },
          {
            icon: Users,
            value: String(data.totalEnrollments || 0),
            label: "Total Enrollments",
          },
          {
            icon: Star,
            value: data.averageRating || "0.0",
            label: "Average Rating",
          },
          { icon: DollarSign, value: "$0.00", label: "Total Earnings" },
        ]);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        setError(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getFilteredCourses = () => {
    if (activeFilter === "All Courses") return filteredCourses;
    return filteredCourses.filter((c) => c.status === activeFilter);
  };

  const displayedCourses = getFilteredCourses();

  return (
    <div className="cm-page">
      {/* Navbar */}
      <header className="cm-navbar">
        <div className="cm-navbar-left">
          <span className="cm-logo-mark">◆</span>
          <span className="cm-logo-text">SkillCraft</span>
        </div>

        <nav className="cm-nav-links">
          <Link to="/" className="cm-nav-link">
            Home
          </Link>
          <Link to="/courses" className="cm-nav-link">
            Courses
          </Link>
          <Link
            to="/tutor/dashboard"
            className="cm-nav-link cm-nav-link--active"
          >
            Tutors
          </Link>
          <Link to="/about" className="cm-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="cm-nav-link">
            Contact
          </Link>
        </nav>

        <div className="cm-navbar-right">
          <button className="cm-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="cm-icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="cm-notif-dot" />
          </button>
          <Link to="/login" className="cm-btn cm-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="cm-btn cm-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="cm-main">
        {/* Heading */}
        <div className="cm-heading-row">
          <div>
            <h1>My Courses</h1>
            <div className="cm-breadcrumb">
              <Link to="/tutor/dashboard">Dashboard</Link>
              <ChevronRight size={14} />
              <Link to="/tutor/dashboard">Tutor</Link>
              <ChevronRight size={14} />
              <span>My Courses</span>
            </div>
          </div>
          <Link to="/tutor/courses/create" className="cm-btn cm-btn--primary">
            <Plus size={16} />
            Create Course
          </Link>
        </div>

        {/* Stats */}
        <section className="cm-stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="cm-stat-card" key={label}>
              <div className="cm-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="cm-stat-value">{value}</p>
                <p className="cm-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Filter tabs + search */}
        <div className="cm-toolbar">
          <div className="cm-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`cm-filter-tab ${
                  activeFilter === tab ? "cm-filter-tab--active" : ""
                }`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="cm-toolbar-right">
            <div className="cm-search">
              <Search size={15} className="cm-search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="cm-sort">
              <span>Sort by: Recent</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* Course table */}
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="cm-table-wrap">
            <table className="cm-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrollments</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {displayedCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="cm-course-cell">
                        <img src={course.image} alt={course.title} />
                        <div>
                          <p className="cm-course-title">{course.title}</p>
                          <p className="cm-course-updated">{course.updated}</p>
                        </div>
                      </div>
                    </td>
                    <td>{course.enrollments} Enrollments</td>
                    <td>
                      <span className="cm-rating">
                        <Star size={13} className="cm-star-icon" />
                        {course.rating} ({course.reviews})
                      </span>
                    </td>
                    <td>
                      <span
                        className={`cm-status ${statusClassMap[course.status]}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="cm-actions-cell">
                      <button
                        className="cm-menu-btn"
                        onClick={() => toggleMenu(course.id)}
                        aria-label="More actions"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === course.id && (
                        <div className="cm-menu">
                          <Link to={`/tutor/courses/${course.id}/edit`}>
                            Edit Course
                          </Link>
                          <Link to={`/courses/${course.id}`}>View Course</Link>
                          <Link to="/tutor/analytics">Analytics</Link>
                          <button type="button">Duplicate</button>
                          <button type="button" className="cm-menu-danger">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="cm-mobile-list">
              {displayedCourses.map((course) => (
                <div className="cm-mobile-card" key={course.id}>
                  <img src={course.image} alt={course.title} />
                  <div className="cm-mobile-body">
                    <p className="cm-course-title">{course.title}</p>
                    <p className="cm-course-updated">{course.updated}</p>
                    <div className="cm-mobile-meta">
                      <span>{course.enrollments} Students</span>
                      <span className="cm-rating">
                        <Star size={13} className="cm-star-icon" />
                        {course.rating}
                      </span>
                    </div>
                    <span
                      className={`cm-status ${statusClassMap[course.status]}`}
                    >
                      {course.status}
                    </span>
                    <div className="cm-mobile-actions">
                      <Link
                        to={`/tutor/courses/${course.id}/edit`}
                        className="cm-btn cm-btn--outline"
                      >
                        Edit
                      </Link>
                      <Link
                        to="/tutor/analytics"
                        className="cm-btn cm-btn--outline"
                      >
                        Analytics
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="cm-pagination">
          <button className="cm-page-btn" disabled>
            ‹
          </button>
          <button className="cm-page-btn cm-page-btn--active">1</button>
          <button className="cm-page-btn">2</button>
          <button className="cm-page-btn">3</button>
          <button className="cm-page-btn">›</button>
        </div>
      </main>
    </div>
  );
}
