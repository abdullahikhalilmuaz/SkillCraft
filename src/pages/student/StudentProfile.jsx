import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/studentprofile.css";
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
  Trophy,
  Compass,
  BadgeCheck,
  Camera,
} from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
  { icon: BookOpen, label: "My Learning", path: "/student/courses" },
  { icon: GraduationCap, label: "Courses", path: "/courses" },
  { icon: ClipboardCheck, label: "Quizzes", path: "/student/quizzes" },
  { icon: Award, label: "Certificates", path: "/student/certificates" },
  { icon: Heart, label: "Wishlist", path: "/student/wishlist" },
];

const achievements = [
  {
    icon: Star,
    title: "First Course",
    description: "Completed your first course",
  },
  {
    icon: Compass,
    title: "Course Explorer",
    description: "Enrolled in 10+ courses",
  },
  {
    icon: Trophy,
    title: "Quiz Master",
    description: "Scored 90%+ on 5 quizzes",
  },
  {
    icon: BadgeCheck,
    title: "Certificate Earned",
    description: "Earned your first certificate",
  },
];

const settingsCards = [
  { title: "Change Password", description: "Update your account password" },
  {
    title: "Notification Preferences",
    description: "Manage what you get notified about",
  },
  { title: "Privacy", description: "Control your data and visibility" },
];

export default function StudentProfile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("Student");
  const [avatar, setAvatar] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [stats, setStats] = useState([
    { value: "0", label: "Courses" },
    { value: "0", label: "Completed" },
    { value: "0", label: "Certificates" },
    { value: "0h", label: "Learning Time" },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        const user = response.data.user;

        setFullName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setCountry(user.country || "");
        setRole(user.role || "Student");
        setAvatar(user.avatar || "");
        setMemberSince(
          user.createdAt
            ? new Date(user.createdAt).getFullYear().toString()
            : "",
        );

        // Fetch enrollment stats
        try {
          const enrollRes = await api.get("/learning/my-courses");
          const enrollments = enrollRes.data.enrollments || [];
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
            { value: String(enrolled), label: "Courses" },
            { value: String(completed), label: "Completed" },
            { value: "0", label: "Certificates" },
            { value: hoursDisplay || "0h", label: "Learning Time" },
          ]);
        } catch (e) {
          console.error("Failed to fetch enrollments:", e);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setError("Please select a PNG, JPG, JPEG, or WEBP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    setUploadingAvatar(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const avatarUrl = res.data.url;
      setAvatar(avatarUrl);

      // Auto-save profile with new avatar
      await api.put("/profile", {
        name: fullName,
        email: email,
        phone: phone,
        country: country,
        avatar: avatarUrl,
      });

      // Update local storage
      const user = getCurrentUser();
      if (user) {
        user.avatar = avatarUrl;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setSuccess("Avatar updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setError(err.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/profile", {
        name: fullName,
        email: email,
        phone: phone,
        country: country,
        avatar: avatar,
      });

      setSuccess("Profile updated successfully!");

      // Update local storage
      const user = getCurrentUser();
      if (user) {
        user.name = fullName;
        user.email = email;
        user.phone = phone;
        user.country = country;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="sp-page">
        <p>Loading profile...</p>
      </div>
    );

  return (
    <div className="sp-page">
      {/* Sidebar */}
      <aside className="sp-sidebar">
        <div className="sp-sidebar-logo">
          <span className="sp-logo-mark">◆</span>
          <span className="sp-logo-text">SkillCraft</span>
        </div>

        <nav className="sp-sidebar-nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link to={path} key={label} className="sp-nav-item">
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sp-sidebar-bottom">
          <Link to="/student/profile" className="sp-nav-item">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </Link>
          <Link
            to="/student/profile"
            className="sp-nav-item sp-nav-item--active"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="sp-content">
        {/* Topbar */}
        <header className="sp-topbar">
          <div className="sp-topbar-spacer" />
          <div className="sp-topbar-right">
            <button className="sp-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="sp-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="sp-notif-dot" />
            </button>
            <div className="sp-user-chip">
              <img
                src={
                  avatar ||
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
                }
                alt="Profile avatar"
                className="sp-user-avatar"
              />
              <span className="sp-user-name">
                {fullName.split(" ")[0] || "Student"}
              </span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="sp-main">
          <h1 className="sp-page-title">My Profile</h1>

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#f0fdf4",
                color: "#15803d",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          {/* Profile hero */}
          <section className="sp-hero">
            <div className="sp-hero-avatar-wrap">
              <img
                src={
                  avatar ||
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop"
                }
                alt="Profile avatar"
                className="sp-hero-avatar"
              />
              <label className="sp-avatar-upload" htmlFor="avatarUpload">
                <Camera size={16} />
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  hidden
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </label>
              {uploadingAvatar && (
                <span className="sp-avatar-uploading">Uploading...</span>
              )}
            </div>
            <div className="sp-hero-info">
              <p className="sp-hero-name">{fullName || "Student"}</p>
              <p className="sp-hero-role">{role}</p>
              <p className="sp-hero-email">{email}</p>
              <p className="sp-hero-member">Member since {memberSince}</p>
            </div>
            <button className="sp-btn sp-btn--outline sp-hero-edit">
              Edit Profile
            </button>
          </section>

          {/* Stats */}
          <section className="sp-stats">
            {stats.map(({ value, label }) => (
              <div className="sp-stat-card" key={label}>
                <p className="sp-stat-value">{value}</p>
                <p className="sp-stat-label">{label}</p>
              </div>
            ))}
          </section>

          {/* Main two-column content */}
          <section className="sp-columns">
            {/* Left: Personal info */}
            <div className="sp-panel">
              <h2 className="sp-panel-title">Personal Information</h2>

              <div className="sp-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="sp-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="sp-field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="sp-field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  placeholder="Enter your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <button
                className="sp-btn sp-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Right: Achievements */}
            <div className="sp-panel">
              <h2 className="sp-panel-title">Achievements</h2>
              <div className="sp-achievements">
                {achievements.map(({ icon: Icon, title, description }) => (
                  <div className="sp-achievement-card" key={title}>
                    <div className="sp-achievement-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="sp-achievement-title">{title}</p>
                      <p className="sp-achievement-description">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Account settings */}
          <section className="sp-section">
            <h2 className="sp-section-title">Account Settings</h2>
            <div className="sp-settings-grid">
              {settingsCards.map(({ title, description }) => (
                <button className="sp-settings-card" key={title}>
                  <p className="sp-settings-card-title">{title}</p>
                  <p className="sp-settings-card-description">{description}</p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}