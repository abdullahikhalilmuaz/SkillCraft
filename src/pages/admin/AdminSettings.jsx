import React, { useEffect, useState } from "react";
import { Save, User, Mail, Phone, MapPin } from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

export default function AdminSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
      });
    }
    setLoading(false);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback("");
      const res = await api.put("/profile", form);
      // Refresh localStorage user data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setFeedback("Profile updated successfully.");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setFeedback(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Settings</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            Manage your administrator profile
          </p>
        </div>
      </div>

      <div className="ad-two-col">
        {/* Form */}
        <div className="ad-section-card">
          <h2>Admin Profile</h2>
          <p className="ad-section-sub">
            Update your personal information below.
          </p>

          <form onSubmit={handleSave}>
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
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. Nigeria"
              />
            </div>

            {feedback && (
              <p
                style={{
                  fontSize: 13,
                  margin: "0 0 12px",
                  color: feedback.includes("success")
                    ? "var(--green-600)"
                    : "var(--red-600)",
                }}
              >
                {feedback}
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

        {/* Info panel */}
        <div className="ad-section-card">
          <h2>Platform Info</h2>
          <p className="ad-section-sub">
            Overview of the SkillCraft AI platform.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span style={{ color: "var(--ink-600)" }}>Your Role</span>
              <span className="ad-badge ad-badge--success">Administrator</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
