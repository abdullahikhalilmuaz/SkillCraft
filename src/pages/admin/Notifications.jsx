import React, { useEffect, useState } from "react";
import { Bell, Send } from "lucide-react";
import api from "../../services/api";

const audiences = [
  { value: "all", label: "All Users" },
  { value: "students", label: "Students Only" },
  { value: "tutors", label: "Tutors Only" },
];

export default function Notifications() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "all",
  });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/notifications");
      setHistory(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setFeedback("Title and message are required.");
      return;
    }
    try {
      setSending(true);
      setFeedback("");
      await api.post("/admin/notifications", form);
      setForm({ title: "", message: "", audience: "all" });
      setFeedback("Notification sent successfully.");
      fetchHistory();
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setFeedback(
        err.response?.data?.message || "Failed to send notification.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Notifications</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            Send announcements to users and view history
          </p>
        </div>
      </div>

      <div className="ad-two-col">
        {/* Send form */}
        <div className="ad-section-card">
          <h2>Send New Notification</h2>
          <p className="ad-section-sub">
            Compose a message and choose who should receive it.
          </p>
          <form onSubmit={handleSend}>
            <div className="ad-form-group">
              <label>Title</label>
              <input
                className="ad-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. New Course Available"
              />
            </div>

            <div className="ad-form-group">
              <label>Message</label>
              <textarea
                className="ad-textarea"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write the announcement..."
              />
            </div>

            <div className="ad-form-group">
              <label>Audience</label>
              <div className="ad-chip-row">
                {audiences.map((a) => (
                  <button
                    type="button"
                    key={a.value}
                    className={`ad-chip ${
                      form.audience === a.value ? "ad-chip--active" : ""
                    }`}
                    onClick={() => setForm({ ...form, audience: a.value })}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
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
              disabled={sending}
              style={{ width: "100%" }}
            >
              <Send
                size={15}
                style={{ marginRight: 6, verticalAlign: "middle" }}
              />
              {sending ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="ad-section-card">
          <h2>Preview</h2>
          <p className="ad-section-sub">How the notification will appear.</p>
          <div
            style={{
              border: "1px solid #f0ecf5",
              borderRadius: 12,
              padding: 16,
              background: "#fafbfc",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div className="ad-stat-icon" style={{ width: 36, height: 36 }}>
                <Bell size={16} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>
                  {form.title || "Notification Title"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--ink-400)",
                    textTransform: "capitalize",
                  }}
                >
                  To: {form.audience}
                </p>
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--ink-600)",
                lineHeight: 1.5,
              }}
            >
              {form.message || "Your message will appear here..."}
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="ad-section-card">
        <h2>Notification History</h2>
        <p className="ad-section-sub">
          {history.length} notification{history.length === 1 ? "" : "s"} sent
        </p>

        <div className="ad-table-wrap" style={{ boxShadow: "none" }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Audience</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: 30,
                      color: "var(--ink-400)",
                    }}
                  >
                    No notifications sent yet.
                  </td>
                </tr>
              ) : (
                history.map((n) => (
                  <tr key={n._id}>
                    <td style={{ fontWeight: 600 }}>{n.title}</td>
                    <td style={{ maxWidth: 300 }}>
                      <span
                        style={{
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "var(--ink-600)",
                        }}
                        title={n.message}
                      >
                        {n.message}
                      </span>
                    </td>
                    <td>
                      <span
                        className="ad-badge ad-badge--neutral"
                        style={{ textTransform: "capitalize" }}
                      >
                        {n.audience}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--ink-400)" }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
