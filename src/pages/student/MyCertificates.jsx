import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Printer, Search } from "lucide-react";
import api from "../../services/api";
import "../../styles/admin.css";

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get("/learning/my-certificates");
        setCertificates(res.data.certificates);
      } catch (err) {
        console.error("Failed to fetch certificates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const filtered = certificates.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.course?.title?.toLowerCase().includes(term) ||
      c.certificateId?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <div className="ad-header">
        <div>
          <h1>My Certificates</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            {certificates.length} certificate{certificates.length === 1 ? "" : "s"} earned
          </p>
        </div>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search">
          <Search size={16} color="#9c93a8" />
          <input
            placeholder="Search by course or certificate ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Certificate ID</th>
              <th>Course</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Loading certificates...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="ad-empty" style={{ padding: "40px 0" }}>
                    <Award size={32} style={{ opacity: 0.4 }} />
                    <h3>No certificates yet</h3>
                    <p>Complete a course to earn your first certificate!</p>
                    <Link to="/student/courses" className="ad-btn ad-btn--primary">
                      Go to My Learning
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((cert) => (
                <tr key={cert._id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {cert.certificateId}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {cert.course?.title || "—"}
                    <div style={{ fontSize: 12, color: "var(--ink-400)", fontWeight: 400 }}>
                      {cert.course?.level} • {cert.course?.category}
                    </div>
                  </td>
                  <td>{new Date(cert.completionDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`ad-badge ${
                        cert.status === "active"
                          ? "ad-badge--success"
                          : "ad-badge--danger"
                      }`}
                    >
                      {cert.status === "active" ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/student/certificates/${cert._id}`}
                      className="ad-btn ad-btn--primary"
                      style={{
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <Printer size={14} style={{ marginRight: 4 }} />
                      View / Print
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}