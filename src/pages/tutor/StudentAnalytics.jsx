import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/studentanalytics.css";
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
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle2,
  Star,
  BarChart3,
} from "lucide-react";
import api from "../../services/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/tutor/dashboard" },
  { icon: BookOpen, label: "My Courses", path: "/tutor/courses" },
  { icon: ClipboardCheck, label: "Quizzes", path: "/tutor/quizzes" },
  { icon: BarChart3, label: "Analytics", path: "/tutor/analytics" },
  { icon: GraduationCap, label: "Students", path: "/tutor/students" },
];

export default function StudentAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completionRate: 0,
    averageRating: 0,
    totalLessons: 0,
    totalQuizzes: 0,
  });
  const [topCourses, setTopCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const overviewRes = await api.get("/tutor/analytics/overview");
        setOverview(overviewRes.data.data);

        const coursesRes = await api.get("/tutor/analytics/top-courses");
        setTopCourses(coursesRes.data.courses || []);

        const activityRes = await api.get("/tutor/analytics/activity");
        setRecentActivity(activityRes.data.activity || []);

        const engagementRes = await api.get("/tutor/analytics/engagement");
        setWeeklyData(engagementRes.data.data || [0, 0, 0, 0, 0, 0, 0]);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load analytics. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statCards = [
    {
      icon: Users,
      value: overview.totalStudents.toLocaleString(),
      label: "Total Students",
      trend: "",
      trendUp: true,
    },
    {
      icon: Users,
      value: overview.activeStudents.toLocaleString(),
      label: "Active Students",
      trend: "",
      trendUp: true,
    },
    {
      icon: BarChart3,
      value: `${overview.averageProgress}%`,
      label: "Avg. Progress",
      trend: "",
      trendUp: true,
    },
    {
      icon: Award,
      value: `${overview.completionRate}%`,
      label: "Completion Rate",
      trend: "",
      trendUp: true,
    },
    {
      icon: Star,
      value: overview.averageRating.toFixed(1),
      label: "Avg. Rating",
      trend: "",
      trendUp: false,
    },
    {
      icon: BookOpen,
      value: overview.totalCourses,
      label: "Total Courses",
      trend: "",
      trendUp: true,
    },
  ];

  if (loading)
    return (
      <div className="sa-page">
        <p className="sa-loading">Loading analytics...</p>
      </div>
    );

  return (
    <div className="sa-page">
      {/* Sidebar */}
      <aside className="sa-sidebar">
        <div className="sa-sidebar-logo">
          <span className="sa-logo-mark">◆</span>
          <span className="sa-logo-text">SkillCraft</span>
        </div>

        <nav className="sa-sidebar-nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              to={path}
              key={label}
              className={`sa-nav-item ${
                label === "Analytics" ? "sa-nav-item--active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sa-sidebar-bottom">
          <Link to="/student/profile" className="sa-nav-item">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </Link>
          <Link to="/student/profile" className="sa-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="sa-content">
        {/* Topbar */}
        <header className="sa-topbar">
          <div className="sa-topbar-spacer" />
          <div className="sa-topbar-right">
            <button className="sa-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="sa-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="sa-notif-dot" />
            </button>
            <div className="sa-user-chip">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Tutor avatar"
                className="sa-user-avatar"
              />
              <span className="sa-user-name">Tutor</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="sa-main">
          {/* Heading */}
          <div className="sa-heading">
            <h1>Student Analytics</h1>
            <p className="sa-subtitle">
              Track student progress, engagement, and course performance.
            </p>
          </div>

          {error && (
            <div className="sa-error">
              <p>{error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <section className="sa-stats-grid">
            {statCards.map((stat) => (
              <div className="sa-stat-card" key={stat.label}>
                <div className="sa-stat-header">
                  <div className="sa-stat-icon">
                    <stat.icon size={20} />
                  </div>
                  {stat.trend && (
                    <span
                      className={`sa-stat-trend ${
                        stat.trendUp
                          ? "sa-stat-trend--up"
                          : "sa-stat-trend--down"
                      }`}
                    >
                      {stat.trendUp ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="sa-stat-value">{stat.value}</p>
                <p className="sa-stat-label">{stat.label}</p>
              </div>
            ))}
          </section>

          {/* Charts Row */}
          <section className="sa-charts-row">
            <div className="sa-chart-card sa-chart-card--full">
              <div className="sa-chart-header">
                <h3>Weekly Student Engagement</h3>
                <span className="sa-chart-period">Last 7 Days</span>
              </div>
              <div className="sa-chart-bars">
                {weeklyData.map((value, index) => (
                  <div key={index} className="sa-bar-group">
                    <div
                      className="sa-bar"
                      style={{ height: `${Math.max(value, 4)}px` }}
                    />
                    <span className="sa-bar-label">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Row */}
          <section className="sa-bottom-row">
            {/* Top Courses */}
            <div className="sa-panel">
              <div className="sa-panel-header">
                <h3>Top Performing Courses</h3>
                <Link to="/tutor/courses" className="sa-view-all">
                  View All
                </Link>
              </div>
              <ul className="sa-top-courses">
                {topCourses.length === 0 ? (
                  <p className="sa-empty-text">No courses yet.</p>
                ) : (
                  topCourses.map((course) => (
                    <li key={course.title} className="sa-top-course">
                      <div className="sa-top-course-info">
                        <p className="sa-top-course-title">{course.title}</p>
                        <p className="sa-top-course-students">
                          {course.students} students
                        </p>
                      </div>
                      <div className="sa-top-course-rating">
                        <Star size={14} className="sa-star-icon" />
                        {course.rating.toFixed(1)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Recent Activity */}
            <div className="sa-panel">
              <div className="sa-panel-header">
                <h3>Recent Activity</h3>
                <span className="sa-activity-count">
                  {recentActivity.length} updates
                </span>
              </div>
              <ul className="sa-activity-list">
                {recentActivity.length === 0 ? (
                  <p className="sa-empty-text">No recent activity.</p>
                ) : (
                  recentActivity.map((activity, index) => {
                    const time = new Date(activity.time);
                    const now = new Date();
                    const diff = Math.floor((now - time) / (1000 * 60));
                    let timeAgo = "Just now";
                    if (diff > 60) timeAgo = `${Math.floor(diff / 60)}h ago`;
                    if (diff > 1440)
                      timeAgo = `${Math.floor(diff / 1440)}d ago`;
                    if (diff < 1) timeAgo = "Just now";

                    return (
                      <li key={index} className="sa-activity-item">
                        <div className="sa-activity-icon">
                          {activity.action === "completed" && (
                            <CheckCircle2 size={14} color="#16a34a" />
                          )}
                          {activity.action === "enrolled" && (
                            <Users size={14} color="#9333ea" />
                          )}
                          {activity.action === "scored" && (
                            <Star size={14} color="#facc15" />
                          )}
                        </div>
                        <div className="sa-activity-info">
                          <p className="sa-activity-text">
                            <strong>{activity.student}</strong>{" "}
                            {activity.action === "completed" && "completed"}
                            {activity.action === "enrolled" && "enrolled in"}
                            {activity.action === "scored" && "scored"}{" "}
                            <span className="sa-activity-course">
                              {activity.course}
                            </span>
                          </p>
                          <p className="sa-activity-time">{timeAgo}</p>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}