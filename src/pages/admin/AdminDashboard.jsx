import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCheck, BookOpen, Award, FileQuestion, CheckCircle } from "lucide-react";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Failed to load data.</p>;

  const statCards = [
    { icon: Users, value: stats.totalStudents, label: "Total Students" },
    { icon: UserCheck, value: stats.totalTutors, label: "Total Tutors" },
    { icon: BookOpen, value: stats.totalCourses, label: "Total Courses" },
    { icon: CheckCircle, value: stats.activeCourses, label: "Active Courses" },
    { icon: Award, value: stats.completedCourses, label: "Completed Courses" },
    { icon: Award, value: stats.certificatesIssued, label: "Certificates Issued" },
    { icon: FileQuestion, value: stats.quizAttempts, label: "Quiz Attempts" },
  ];

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Admin Dashboard</h1>
          <div className="ad-breadcrumb">
            <Link to="/admin/dashboard">Home</Link> <span>/</span> <span>Dashboard</span>
          </div>
        </div>
      </div>

      <div className="ad-stats-grid">
        {statCards.map(({ icon: Icon, value, label }) => (
          <div className="ad-stat-card" key={label}>
            <div className="ad-stat-icon"><Icon size={22} /></div>
            <div>
              <p className="ad-stat-value">{value}</p>
              <p className="ad-stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-table-wrap">
        <div style={{ padding: "20px", borderBottom: "1px solid #f0ecf5" }}>
          <h2 style={{ fontSize: "16px", margin: 0 }}>Recent Activities</h2>
        </div>
        <table className="ad-table">
          <thead>
            <tr><th>Activity</th><th>Time</th></tr>
          </thead>
          <tbody>
            {stats.recentActivities.map((act) => (
              <tr key={act.id}>
                <td>{act.message}</td>
                <td>{new Date(act.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}