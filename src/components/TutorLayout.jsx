import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  ClipboardCheck,
  BarChart2,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import "../styles/tutorlayout.css";
import { logout, getCurrentUser } from "../services/authService";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/tutor/dashboard" },
  { icon: BookOpen, label: "My Courses", path: "/tutor/courses" },
  { icon: PlusCircle, label: "Create Course", path: "/tutor/courses/create" },
  { icon: ClipboardCheck, label: "Quizzes", path: "/tutor/quizzes" },
  { icon: BarChart2, label: "Analytics", path: "/tutor/analytics" },
];

export default function TutorLayout() {
  const location = useLocation();
  const user = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="tl-page">
      {/* Mobile topbar */}
      <div className="tl-mobile-topbar">
        <button
          className="tl-hamburger"
          onClick={() => setSidebarOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="tl-mobile-title">SkillCraft Tutor</span>
      </div>

      {sidebarOpen && <div className="tl-backdrop" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`tl-sidebar ${sidebarOpen ? "tl-sidebar--open" : ""}`}>
        <div className="tl-sidebar-logo">
          <span className="tl-logo-mark">◆</span>
          <span className="tl-logo-text">SkillCraft</span>
        </div>

        <nav className="tl-nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={closeSidebar}
              className={`tl-nav-item ${
                location.pathname === path ? "tl-nav-item--active" : ""
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="tl-sidebar-bottom">
          <Link
            to="/tutor/settings"
            onClick={closeSidebar}
            className={`tl-nav-item ${
              location.pathname === "/tutor/settings"
                ? "tl-nav-item--active"
                : ""
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
          <button onClick={logout} className="tl-nav-item tl-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <Link
            to="/tutor/settings"
            onClick={closeSidebar}
            className="tl-mini-profile"
          >
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              }
              alt="Tutor"
              className="tl-mini-avatar"
            />
            <div>
              <p className="tl-mini-name">{user?.name || "Tutor"}</p>
              <p className="tl-mini-role">Tutor</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="tl-content">
        <header className="tl-topbar">
          <div className="tl-topbar-spacer" />
          <div className="tl-topbar-right">
            <Link to="/tutor/settings" className="tl-user-chip">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                }
                alt="Tutor"
                className="tl-user-avatar"
              />
              <span className="tl-user-name">{user?.name || "Tutor"}</span>
              <ChevronDown size={16} />
            </Link>
          </div>
        </header>

        <main className="tl-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
