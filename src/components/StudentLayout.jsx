import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import "../styles/studentlayout.css";
import { logout, getCurrentUser } from "../services/authService";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
  { icon: BookOpen, label: "My Learning", path: "/student/courses" },
  { icon: GraduationCap, label: "Browse Courses", path: "/courses" },
  { icon: ClipboardCheck, label: "Quizzes", path: "/student/quizzes" },
  { icon: Award, label: "Certificates", path: "/student/certificates" },
];

export default function StudentLayout() {
  const location = useLocation();
  const user = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  const isActive = (path) => {
    if (path === "/courses") return location.pathname === "/courses";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sl-page">
      {/* Mobile topbar */}
      <div className="sl-mobile-topbar">
        <button
          className="sl-hamburger"
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="sl-mobile-title">SkillCraft</span>
      </div>

      {sidebarOpen && <div className="sl-backdrop" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`sl-sidebar ${sidebarOpen ? "sl-sidebar--open" : ""}`}>
        <div className="sl-sidebar-logo">
          <span className="sl-logo-mark">◆</span>
          <span className="sl-logo-text">SkillCraft</span>
        </div>

        <nav className="sl-nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={closeSidebar}
              className={`sl-nav-item ${
                isActive(path) ? "sl-nav-item--active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sl-sidebar-bottom">
          <Link to="/contact" onClick={closeSidebar} className="sl-nav-item">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </Link>
          <Link
            to="/student/settings"
            onClick={closeSidebar}
            className={`sl-nav-item ${
              location.pathname === "/student/settings"
                ? "sl-nav-item--active"
                : ""
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button onClick={logout} className="sl-nav-item sl-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <Link
            to="/student/settings"
            onClick={closeSidebar}
            className="sl-mini-profile"
          >
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
              }
              alt="Student"
              className="sl-mini-avatar"
            />
            <div>
              <p className="sl-mini-name">{user?.name || "Student"}</p>
              <p className="sl-mini-role">Student</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="sl-content">
        <header className="sl-topbar">
          <div className="sl-topbar-spacer" />
          <div className="sl-topbar-right">
            <Link to="/student/settings" className="sl-user-chip">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
                }
                alt="Student"
                className="sl-user-avatar"
              />
              <span className="sl-user-name">{user?.name || "Student"}</span>
              <ChevronDown size={16} />
            </Link>
          </div>
        </header>

        <main className="sl-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
