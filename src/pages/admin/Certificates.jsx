import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ← ADDED
import { Search, Award, Ban, CheckCircle, Plus, Printer } from "lucide-react"; // ← Printer added
import api from "../../services/api";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ studentId: "", courseId: "" });
  const [generating, setGenerating] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/certificates");
      setCertificates(res.data.certificates);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openModal = async () => {
    setForm({ studentId: "", courseId: "" });
    setModalError("");
    setShowModal(true);
    try {
      const res = await api.get("/admin/certificates/form-data");
      setStudents(res.data.students);
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Failed to load form data", err);
      setModalError("Could not load students/courses.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ studentId: "", courseId: "" });
    setModalError("");
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) {
      setModalError("Please select both a student and a course.");
      return;
    }
    try {
      setGenerating(true);
      setModalError("");
      await api.post("/admin/certificates", form);
      closeModal();
      fetchCertificates();
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Failed to generate certificate.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Revoke this certificate? This cannot be undone."))
      return;
    try {
      await api.patch(`/admin/certificates/${id}/revoke`);
      fetchCertificates();
    } catch (err) {
      console.error("Failed to revoke", err);
    }
  };

  const filtered = certificates.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.student?.name?.toLowerCase().includes(term) ||
      c.student?.email?.toLowerCase().includes(term) ||
      c.course?.title?.toLowerCase().includes(term) ||
      c.certificateId?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Certificates</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            {certificates.length} certificate
            {certificates.length === 1 ? "" : "s"} issued
          </p>
        </div>
        <button className="ad-btn ad-btn--primary" onClick={openModal}>
          <Plus size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Generate Certificate
        </button>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search">
          <Search size={16} color="#9c93a8" />
          <input
            placeholder="Search by student, course, or certificate ID..."
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
              <th>Student</th>
              <th>Course</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading certificates...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="ad-empty" style={{ padding: "40px 0" }}>
                    <Award size={32} style={{ opacity: 0.4 }} />
                    <h3>No certificates yet</h3>
                    <p>
                      Click "Generate Certificate" to issue one manually, or
                      wait for students to complete courses.
                    </p>
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
                    {cert.student?.name || "—"}
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-400)",
                        fontWeight: 400,
                      }}
                    >
                      {cert.student?.email}
                    </div>
                  </td>
                  <td>{cert.course?.title || "—"}</td>
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
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {/* Print / View button — always available */}
                      <Link
                        to={`/admin/certificates/${cert._id}`}
                        className="ad-btn ad-btn--primary"
                        style={{
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Printer size={14} style={{ marginRight: 4 }} />
                        Print
                      </Link>

                      {cert.status === "active" ? (
                        <button
                          className="ad-btn ad-btn--danger"
                          onClick={() => handleRevoke(cert._id)}
                        >
                          <Ban
                            size={14}
                            style={{ marginRight: 4, verticalAlign: "middle" }}
                          />
                          Revoke
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--ink-400)",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircle size={13} style={{ marginRight: 4 }} />
                          Revoked
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Certificate Modal */}
      {showModal && (
        <div className="ad-modal-overlay" onClick={closeModal}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2>Generate Certificate</h2>
              <button className="ad-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="ad-modal-body">
                <div className="ad-form-group">
                  <label>Student</label>
                  <select
                    className="ad-select"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({ ...form, studentId: e.target.value })
                    }
                  >
                    <option value="">-- Select a student --</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ad-form-group">
                  <label>Course</label>
                  <select
                    className="ad-select"
                    value={form.courseId}
                    onChange={(e) =>
                      setForm({ ...form, courseId: e.target.value })
                    }
                  >
                    <option value="">-- Select a course --</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {modalError && (
                  <p
                    style={{ color: "var(--red-600)", fontSize: 13, margin: 0 }}
                  >
                    {modalError}
                  </p>
                )}
              </div>
              <div className="ad-modal-actions">
                <button
                  type="button"
                  className="ad-btn ad-btn--ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ad-btn ad-btn--primary"
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
