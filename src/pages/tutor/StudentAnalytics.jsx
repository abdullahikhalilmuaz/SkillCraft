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
  PieChart,
  LineChart,
  Calendar,
} from "lucide-react";
import api from "../../services/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen, label: "My Learning" },
  { icon: GraduationCap, label: "Courses" },
  { icon: ClipboardCheck, label: "Quizzes" },
  { icon: Award, label: "Certificates" },
  { icon: Heart, label: "Wishlist" },
];

export default function StudentAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    completionRate: 0,
    averageRating: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    totalLessons: 0,
    recentActivity: [],
    topCourses: [],
    weeklyData: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch tutor stats from backend
        const response = await api.get("/courses/tutor/stats");

        // Mock additional analytics data
        // In production, these would come from dedicated analytics endpoints
        setStats({
          totalStudents: 3420,
          activeStudents: 1847,
          averageProgress: 68,
          completionRate: 42,
          averageRating: 4.8,
          totalCourses: response.data.stats?.totalCourses || 0,
          totalQuizzes: 24,
          totalLessons: 86,
          recentActivity: [
            {
              student: "Emma Wilson",
              action: "completed",
              course: "Beginner Cream Making",
              time: "2 hours ago",
            },
            {
              student: "James Rodriguez",
              action: "enrolled",
              course: "Advanced Perfume Blending",
              time: "4 hours ago",
            },
            {
              student: "Sophia Chen",
              action: "scored",
              course: "Natural Soap Making",
              score: "92%",
              time: "6 hours ago",
            },
            {
              student: "Liam O'Brien",
              action: "completed",
              course: "Herbal Soap Making",
              time: "1 day ago",
            },
          ],
          topCourses: [
            { title: "Beginner Cream Making", students: 842, rating: 4.9 },
            { title: "Natural Soap Making", students: 615, rating: 4.7 },
            { title: "Perfume Making Basics", students: 423, rating: 4.8 },
            { title: "Advanced Soap Making", students: 312, rating: 4.6 },
          ],
          weeklyData: [65, 72, 58, 81, 69, 74, 78],
        });
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load analytics. Please try again."
        );
        // Set fallback mock data
        setStats({
          totalStudents: 0,
          activeStudents: 0,
          averageProgress: 0,
          completionRate: 0,
          averageRating: 0,
          totalCourses: 0,
          totalQuizzes: 0,
          totalLessons: 0,
          recentActivity: [],
          topCourses: [],
          weeklyData: [0, 0, 0, 0, 0, 0, 0],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const statCards = [
    {
      icon: Users,
      value: stats.totalStudents.toLocaleString(),
      label: "Total Students",
      trend: "+12%",
      trendUp: true,
    },
    {
      icon: Users,
      value: stats.activeStudents.toLocaleString(),
      label: "Active Students",
      trend: "+8%",
      trendUp: true,
    },
    {
      icon: BarChart3,
      value: `${stats.averageProgress}%`,
      label: "Avg. Progress",
      trend: "+5%",
      trendUp: true,
    },
    {
      icon: Award,
      value: `${stats.completionRate}%`,
      label: "Completion Rate",
      trend: "+3%",
      trendUp: true,
    },
    {
      icon: Star,
      value: stats.averageRating.toFixed(1),
      label: "Avg. Rating",
      trend: "-0.2",
      trendUp: false,
    },
    {
      icon: BookOpen,
      value: stats.totalCourses,
      label: "Total Courses",
      trend: "+2",
      trendUp: true,
    },
  ];

  return (
    <div className="sa-page">
      {/* Sidebar */}
      <aside className="sa-sidebar">
        <div className="sa-sidebar-logo">
          <span className="sa-logo-mark">◆</span>
          <span className="sa-logo-text">SkillCraft</span>
        </div>

        <nav className="sa-sidebar-nav">
          {navItems.map(({ icon: Icon, label }) => (
            <Link
              to={
                label === "Dashboard"
                  ? "/tutor/dashboard"
                  : label === "My Learning"
                  ? "/tutor/courses"
                  : label === "Courses"
                  ? "/tutor/courses"
                  : label === "Quizzes"
                  ? "/tutor/quizzes"
                  : "#"
              }
              key={label}
              className={`sa-nav-item ${
                label === "Dashboard" ? "sa-nav-item--active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sa-sidebar-bottom">
          <a href="#" className="sa-nav-item">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </a>
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
                alt="Sarah avatar"
                className="sa-user-avatar"
              />
              <span className="sa-user-name">Sarah</span>
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

          {/* Loading */}
          {loading && <p className="sa-empty">Loading analytics...</p>}

          {/* Error */}
          {!loading && error && <p className="sa-empty">{error}</p>}

          {/* Stats Grid */}
          {!loading && !error && (
            <>
              <section className="sa-stats-grid">
                {statCards.map((stat) => (
                  <div className="sa-stat-card" key={stat.label}>
                    <div className="sa-stat-header">
                      <div className="sa-stat-icon">
                        <stat.icon size={20} />
                      </div>
                      <span
                        className={`sa-stat-trend ${
                          stat.trendUp ? "sa-stat-trend--up" : "sa-stat-trend--down"
                        }`}
                      >
                        {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {stat.trend}
                      </span>
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
                    {stats.weeklyData.map((value, index) => (
                      <div key={index} className="sa-bar-group">
                        <div
                          className="sa-bar"
                          style={{ height: `${(value / 100) * 120}px` }}
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
                    {stats.topCourses.map((course) => (
                      <li key={course.title} className="sa-top-course">
                        <div className="sa-top-course-info">
                          <p className="sa-top-course-title">{course.title}</p>
                          <p className="sa-top-course-students">
                            {course.students} students
                          </p>
                        </div>
                        <div className="sa-top-course-rating">
                          <Star size={14} className="sa-star-icon" />
                          {course.rating}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Activity */}
                <div className="sa-panel">
                  <div className="sa-panel-header">
                    <h3>Recent Activity</h3>
                    <span className="sa-activity-count">
                      {stats.recentActivity.length} updates
                    </span>
                  </div>
                  <ul className="sa-activity-list">
                    {stats.recentActivity.map((activity, index) => (
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
                            {activity.score && (
                              <span className="sa-activity-score">
                                {" "}
                                • {activity.score}
                              </span>
                            )}
                          </p>
                          <p className="sa-activity-time">{activity.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}