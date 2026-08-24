import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/tutordashboard.css";
import { Bell, ClipboardList, Users, CheckSquare, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

const recentCourses = [
  {
    title: "Beginner Cream Making",
    students: "34 Students",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
  },
  {
    title: "Natural Soap Making",
    students: "18 Students",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&h=200&fit=crop",
  },
  {
    title: "Perfume Making Basics",
    students: "30 Students",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
  },
  {
    title: "Advanced Soap Making",
    students: "22 Students",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=200&h=200&fit=crop",
  },
];

const recentActivities = [
  {
    title: "New student enrolled in your course",
    subtitle: "Beginner Cream Making",
    time: "2m ago",
  },
  {
    title: "New review received",
    subtitle: "Natural Soap Making",
    time: "1hr ago",
  },
  {
    title: "Course updated successfully",
    subtitle: "Advanced Perfume Making",
    time: "3hr ago",
  },
  {
    title: "New question in your course",
    subtitle: "Perfume Making Basics",
    time: "5hr ago",
  },
];

const earningsData = [
  { value: 900 },
  { value: 1400 },
  { value: 1100 },
  { value: 1700 },
  { value: 1500 },
  { value: 2000 },
  { value: 1800 },
  { value: 2300 },
  { value: 2100 },
  { value: 2600 },
  { value: 2450 },
];

export default function TutorDashboard() {
  const [stats, setStats] = useState([
    { icon: ClipboardList, value: "0", label: "My Courses" },
    { icon: Users, value: "0", label: "Total Students" },
    { icon: CheckSquare, value: "0", label: "Total Enrollments" },
    { icon: Star, value: "0.0", label: "Average Rating" },
  ]);
  const [loading, setLoading] = useState(true);
  const [tutorName, setTutorName] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setTutorName(user.name || "Tutor");
    }

    const fetchStats = async () => {
      try {
        const response = await api.get("/courses/tutor/stats");
        const data = response.data.stats;
        setStats([
          {
            icon: ClipboardList,
            value: String(data.totalCourses || 0),
            label: "My Courses",
          },
          {
            icon: Users,
            value: String(data.totalEnrollments || 0),
            label: "Total Students",
          },
          {
            icon: CheckSquare,
            value: String(data.totalEnrollments || 0),
            label: "Total Enrollments",
          },
          {
            icon: Star,
            value: data.averageRating || "0.0",
            label: "Average Rating",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch tutor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="td-page">
      {/* Navbar */}
      <header className="td-navbar">
        <div className="td-navbar-left">
          <span className="td-logo-mark">◆</span>
          <span className="td-logo-text">SkillCraft</span>
        </div>

        <nav className="td-nav-links">
          <Link to="/" className="td-nav-link">
            Home
          </Link>
          <Link to="/tutor/courses" className="td-nav-link">
            Courses
          </Link>
          <Link
            to="/tutor/dashboard"
            className="td-nav-link td-nav-link--active"
          >
            Tutors
          </Link>
          <Link to="/about" className="td-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="td-nav-link">
            Contact
          </Link>
        </nav>

        <div className="td-navbar-right">
          <Link to="/login" className="td-btn td-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="td-btn td-btn--primary">
            Sign Up
          </Link>
          <button className="td-icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="td-notif-dot" />
          </button>
          <img
            className="td-avatar"
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Tutor avatar"
          />
        </div>
      </header>

      <main className="td-main">
        {/* Hero */}
        <section className="td-hero">
          <div className="td-hero-text">
            <p className="td-hero-eyebrow">Welcome back,</p>
            <h1 className="td-hero-title">{tutorName.toLocaleUpperCase()}</h1>
            <p className="td-hero-subtitle">
              Here&rsquo;s what&rsquo;s happening with your courses today.
            </p>
          </div>
          <div className="td-hero-art" aria-hidden="true">
            <div className="td-hero-blob" />
            <div className="td-hero-monitor">
              <div className="td-monitor-screen">
                <div className="td-monitor-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="td-monitor-bars">
                  <span style={{ height: "40%" }} />
                  <span style={{ height: "70%" }} />
                  <span style={{ height: "55%" }} />
                  <span style={{ height: "90%" }} />
                  <span style={{ height: "65%" }} />
                </div>
                <div className="td-monitor-pie" />
              </div>
              <div className="td-monitor-stand" />
              <div className="td-grad-cap">🎓</div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="td-stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="td-stat-card" key={label}>
              <div className="td-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="td-stat-value">{value}</p>
                <p className="td-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Content grid */}
        <section className="td-content-grid">
          {/* Recent Courses */}
          <div className="td-panel">
            <div className="td-panel-header">
              <h2>Recent Courses</h2>
              <Link to="/tutor/courses" className="td-view-all">
                View All
              </Link>
            </div>
            <ul className="td-course-list">
              {recentCourses.map((course) => (
                <li className="td-course-item" key={course.title}>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="td-course-thumb"
                  />
                  <div className="td-course-info">
                    <p className="td-course-title">{course.title}</p>
                    <p className="td-course-students">{course.students}</p>
                  </div>
                  <div className="td-course-rating">
                    <Star size={14} className="td-star-icon" />
                    <span>{course.rating}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activities */}
          <div className="td-panel">
            <div className="td-panel-header">
              <h2>Recent Activities</h2>
              <a href="#" className="td-view-all">
                View All
              </a>
            </div>
            <ul className="td-activity-list">
              {recentActivities.map((activity) => (
                <li className="td-activity-item" key={activity.title}>
                  <span className="td-activity-icon">
                    <ClipboardList size={14} />
                  </span>
                  <div className="td-activity-info">
                    <p className="td-activity-title">{activity.title}</p>
                    <p className="td-activity-subtitle">{activity.subtitle}</p>
                  </div>
                  <span className="td-activity-time">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Earnings Overview */}
          <div className="td-panel">
            <div className="td-panel-header">
              <h2>Earnings Overview</h2>
              <select className="td-select" defaultValue="This Month">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>

            <p className="td-earnings-value">$2,450.00</p>
            <p className="td-earnings-delta">+18.5% from last month</p>

            <div className="td-chart-wrap">
              <ResponsiveContainer width="100%" height={90}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient
                      id="tdEarningsFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#9333ea"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9333ea"
                    strokeWidth={2}
                    fill="url(#tdEarningsFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="td-chart-axis">
              <span>1 May</span>
              <span>10 May</span>
              <span>20 May</span>
              <span>31 May</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
