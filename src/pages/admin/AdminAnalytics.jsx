import React, { useEffect, useState } from "react";
import {
  Users,
  UserX,
  UserCheck,
  BookOpen,
  TrendingUp,
  Award,
  FileQuestion,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../../services/api";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>Failed to load analytics.</p>;

  const { user, course, quiz, certificate } = analytics;

  const userChartData = [
    { name: "Active", value: user.activeStudents },
    { name: "Inactive", value: user.inactiveStudents },
  ];

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            Platform-wide performance overview
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="ad-stats-grid" style={{ marginBottom: 24 }}>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <Users size={22} />
          </div>
          <div>
            <p className="ad-stat-value">{user.totalStudents}</p>
            <p className="ad-stat-label">Total Students</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="ad-stat-value">{user.activeStudents}</p>
            <p className="ad-stat-label">Active Students</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <UserX size={22} />
          </div>
          <div>
            <p className="ad-stat-value">{user.inactiveStudents}</p>
            <p className="ad-stat-label">Inactive Students</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">
            <Award size={22} />
          </div>
          <div>
            <p className="ad-stat-value">{certificate.certificatesGenerated}</p>
            <p className="ad-stat-label">Certificates Generated</p>
          </div>
        </div>
      </div>

      {/* Charts + deeper analytics */}
      <div className="ad-two-col">
        {/* User chart */}
        <div className="ad-chart-card">
          <h3 className="ad-chart-title">Student Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={userChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0ecf5"
                vertical={false}
              />
              <XAxis dataKey="name" stroke="#9c93a8" fontSize={12} />
              <YAxis stroke="#9c93a8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #f0ecf5",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="value" fill="#9333ea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course analytics */}
        <div className="ad-chart-card">
          <h3 className="ad-chart-title">Course Analytics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 16,
                background: "#fafbfc",
                borderRadius: 12,
              }}
            >
              <div className="ad-stat-icon">
                <BookOpen size={20} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ink-400)" }}>
                  Most Popular Course
                </p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  {course.popularCourse?.title || "No enrollments yet"}
                </p>
                {course.popularCourse && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "var(--purple-600)",
                    }}
                  >
                    {course.popularCourse.count} enrollments
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 16,
                background: "#fafbfc",
                borderRadius: 12,
              }}
            >
              <div className="ad-stat-icon">
                <TrendingUp size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ink-400)" }}>
                  Course Completion Rate
                </p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
                  {course.completionRate}%
                </p>
                <div
                  style={{
                    width: "100%",
                    height: 6,
                    background: "#f0ecf5",
                    borderRadius: 999,
                    marginTop: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${course.completionRate}%`,
                      height: "100%",
                      background: "var(--purple-600)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz analytics */}
      <div className="ad-chart-card" style={{ marginTop: 20 }}>
        <h3 className="ad-chart-title">Quiz Analytics</h3>
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 200px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: 16,
              background: "#fafbfc",
              borderRadius: 12,
            }}
          >
            <div className="ad-stat-icon">
              <FileQuestion size={20} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--ink-400)" }}>
                Average Quiz Score
              </p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
                {quiz.averageScore}%
              </p>
            </div>
          </div>

          <div style={{ flex: "2 1 300px" }}>
            <div
              style={{
                height: 8,
                background: "#f0ecf5",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${quiz.averageScore}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #9333ea, #7e22ce)",
                }}
              />
            </div>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 12,
                color: "var(--ink-400)",
              }}
            >
              Based on all quiz attempts across the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
