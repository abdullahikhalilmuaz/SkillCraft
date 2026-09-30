import React, { useEffect, useState } from "react";
import { Save, User, Mail, Phone, MapPin, Camera } from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

export default function StudentSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/profile");
        const u = res.data.user || {};
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          country: u.country || "",
          avatar: u.avatar || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        const cached = getCurrentUser();
        if (cached) {
          setForm({
            name: cached.name || "",
            email: cached.email || "",
            phone: cached.phone || "",
            country: cached.country || "",
            avatar: cached.avatar || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFeedback("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback("");
      setError("");
      const res = await api.put("/profile", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setFeedback("Profile updated successfully.");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ad-header" style={{ display: "block" }}>
        <h1>Settings</h1>
        <p style={{ color: "var(--ink-600)" }}>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Settings</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            Manage your student profile information
          </p>
        </div>
      </div>

      <div className="ad-two-col">
        <div className="ad-section-card">
          <h2>Profile Information</h2>
          <p className="ad-section-sub">Update your personal details below.</p>

          <form onSubmit={handleSave}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <img
                src={
                  form.avatar ||
                  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&h=120&fit=crop"
                }
                alt="Avatar"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #f2eafc",
                }}
              />
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  <Camera
                    size={14}
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  Avatar URL
                </label>
                <input
                  className="ad-input"
                  value={form.avatar}
                  onChange={handleChange("avatar")}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="ad-form-group">
              <label>
                <User
                  size={14}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Full Name
              </label>
              <input
                className="ad-input"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Your full name"
              />
            </div>

            <div className="ad-form-group">
              <label>
                <Mail
                  size={14}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Email Address
              </label>
              <input
                type="email"
                className="ad-input"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
              />
            </div>

            <div className="ad-form-group">
              <label>
                <Phone
                  size={14}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Phone
              </label>
              <input
                className="ad-input"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="+234..."
              />
            </div>

            <div className="ad-form-group">
              <label>
                <MapPin
                  size={14}
                  style={{ marginRight: 6, verticalAlign: "middle" }}
                />
                Country
              </label>
              <input
                className="ad-input"
                value={form.country}
                onChange={handleChange("country")}
                placeholder="e.g. Nigeria"
              />
            </div>

            {feedback && (
              <p
                style={{
                  fontSize: 13,
                  margin: "0 0 12px",
                  color: "var(--green-600)",
                }}
              >
                {feedback}
              </p>
            )}
            {error && (
              <p
                style={{
                  fontSize: 13,
                  margin: "0 0 12px",
                  color: "var(--red-600)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="ad-btn ad-btn--primary"
              disabled={saving}
            >
              <Save
                size={15}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="ad-section-card">
          <h2>Account</h2>
          <p className="ad-section-sub">
            Overview of your SkillCraft student account.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-600)" }}>Role</span>
              <span style={{ fontWeight: 600 }}>Student</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-600)" }}>Status</span>
              <span className="ad-badge ad-badge--success">Active</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-600)" }}>Platform</span>
              <span style={{ fontWeight: 600 }}>SkillCraft AI</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-600)" }}>Version</span>
              <span style={{ fontWeight: 600 }}>1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
