import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  FolderTree,
  FileQuestion,
  Award,
  Bell,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import "../styles/admin.css";
import { logout, getCurrentUser } from "../services/authService";
import api from "../services/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Manage Students", path: "/admin/students" },
  { icon: UserCheck, label: "Tutor Approvals", path: "/admin/tutors" },
  { icon: BookOpen, label: "Manage Courses", path: "/admin/courses" },
  { icon: FolderTree, label: "Categories", path: "/admin/categories" },
  { icon: FileQuestion, label: "Quizzes", path: "/admin/quizzes" },
  { icon: Award, label: "Certificates", path: "/admin/certificates" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: BarChart2, label: "Reports & Analytics", path: "/admin/analytics" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const user = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const notifRef = useRef(null);

  const closeSidebar = () => setSidebarOpen(false);

  // Fetch recent notifications on mount and whenever route changes
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setNotifLoading(true);
        const res = await api.get("/admin/notifications");
        setNotifications((res.data.notifications || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setNotifLoading(false);
      }
    };
    fetchNotifs();
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  const recentCount = notifications.filter((n) => {
    const t = new Date(n.createdAt).getTime();
    return Date.now() - t < 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="ad-page">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="ad-mobile-backdrop" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`ad-sidebar ${sidebarOpen ? "ad-sidebar--open" : ""}`}>
        <div className="ad-sidebar-logo">
          <span className="ad-logo-mark">◆</span>
          <span className="ad-logo-text">SkillCraft Admin</span>
        </div>
        <nav>
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={closeSidebar}
              className={`ad-nav-item ${
                location.pathname === path ? "ad-nav-item--active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <div
            style={{
              padding: "0 16px 12px",
              fontSize: "13px",
              color: "var(--ink-600)",
            }}
          >
            Logged in as <strong>{user?.name || "Admin"}</strong>
          </div>
          <button
            onClick={logout}
            className="ad-nav-item"
            style={{
              width: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--red-600)",
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content wrapper with topbar */}
      <div className="ad-content-wrap">
        <header className="ad-topbar">
          <button
            className="ad-mobile-hamburger"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="ad-mobile-title">SkillCraft Admin</span>

          <div className="ad-topbar-spacer" />

          <div className="ad-topbar-right">
            {/* Notification bell + dropdown */}
            <div className="ad-notif-wrap" ref={notifRef}>
              <button
                className="ad-icon-btn"
                aria-label="Notifications"
                onClick={() => setNotifOpen((s) => !s)}
              >
                <Bell size={18} />
                {recentCount > 0 && <span className="ad-notif-dot" />}
              </button>

              {notifOpen && (
                <div className="ad-notif-dropdown">
                  <div className="ad-notif-header">
                    <span>Notifications</span>
                    <span className="ad-notif-count">
                      {notifications.length}
                    </span>
                  </div>

                  <div className="ad-notif-body">
                    {notifLoading ? (
                      <p className="ad-notif-empty">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="ad-notif-empty">
                        No notifications sent yet
                      </p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} className="ad-notif-item">
                          <div className="ad-notif-item-title">{n.title}</div>
                          <div className="ad-notif-item-msg">{n.message}</div>
                          <div className="ad-notif-item-meta">
                            To: {n.audience} ·{" "}
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Link
                    to="/admin/notifications"
                    className="ad-notif-footer"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* User chip */}
            <Link to="/admin/settings" className="ad-user-chip">
              <span className="ad-user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
              <span className="ad-user-name">{user?.name || "Admin"}</span>
              <ChevronDown size={16} />
            </Link>
          </div>
        </header>

        <main className="ad-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
