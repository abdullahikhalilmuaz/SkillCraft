import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCircle2, BookOpen, AlertCircle, Info } from "lucide-react";
import api from "../services/api";
import "../../styles/notificationbell.css";

export default function NotificationBell({
  buttonClassName = "nb-btn",
  dotClassName = "nb-dot",
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Get token for SSE URL
    const token = localStorage.getItem("token"); // or whatever key your authService uses
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const eventSource = new EventSource(
      `${apiUrl}/notifications/stream?token=${token}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_notification") {
        const newNotif = { ...data.notification, isRead: false };
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection lost. Browser will auto-reconnect.", err);
    };

    return () => {
      eventSource.close();
    };
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return; // Already read

    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark as read", err);
      fetchNotifications(); // Revert on failure
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    if (unreadCount === 0) return;

    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      await api.patch("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read", err);
      fetchNotifications();
    }
  };

  // Helper to pick icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "certificate":
        return <CheckCircle2 size={16} color="#10b981" />;
      case "course_update":
        return <BookOpen size={16} color="#3b82f6" />;
      case "system":
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return <Info size={16} color="#8b5cf6" />;
    }
  };

  return (
    <div className="nb-wrap" ref={ref}>
      <button
        type="button"
        className={buttonClassName}
        aria-label="Notifications"
        onClick={() => setOpen((s) => !s)}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className={dotClassName} />}
      </button>

      {open && (
        <div className="nb-dropdown">
          <div className="nb-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  fontSize: "11px",
                  color: "#7c3aed",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="nb-body">
            {loading && notifications.length === 0 ? (
              <p className="nb-empty">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="nb-empty">No notifications yet</p>
            ) : (
              notifications.map((n) => {
                const content = (
                  <div
                    className={`nb-item ${n.isRead ? "nb-item--read" : ""}`}
                    onClick={() => handleMarkAsRead(n._id, n.isRead)}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ marginTop: "2px" }}>{getIcon(n.type)}</div>
                      <div>
                        <div className="nb-item-title">{n.title}</div>
                        <div className="nb-item-msg">{n.message}</div>
                        <div className="nb-item-meta">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );

                // If the notification has a link, wrap it in a React Router Link
                return n.link ? (
                  <Link
                    key={n._id}
                    to={n.link}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => {
                      handleMarkAsRead(n._id, n.isRead);
                      setOpen(false);
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={n._id}>{content}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
