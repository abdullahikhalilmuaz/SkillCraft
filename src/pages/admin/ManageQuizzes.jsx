import React, { useEffect, useState } from "react";
import { FileQuestion, Trash2, Edit2, Search } from "lucide-react";
import api from "../../services/api";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [passMark, setPassMark] = useState(50);
  const [saving, setSaving] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/quizzes");
      setQuizzes(res.data.quizzes);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const openEdit = (quiz) => {
    setEditing(quiz);
    setPassMark(quiz.passMark || 50);
  };

  const closeEdit = () => {
    setEditing(null);
    setPassMark(50);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      await api.put(`/admin/quizzes/${editing._id}`, {
        passMark: Number(passMark),
      });
      closeEdit();
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to update quiz", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      console.error("Failed to delete quiz", err);
    }
  };

  const filtered = quizzes.filter((q) => {
    const term = search.toLowerCase();
    return (
      q.title?.toLowerCase().includes(term) ||
      q.lesson?.title?.toLowerCase().includes(term) ||
      q.lesson?.course?.title?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Manage Quizzes</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            {quizzes.length} quiz{quizzes.length === 1 ? "" : "zes"} across all
            courses
          </p>
        </div>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search">
          <Search size={16} color="#9c93a8" />
          <input
            placeholder="Search by quiz, lesson, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Course</th>
              <th>Questions</th>
              <th>Pass Mark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading quizzes...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="ad-empty" style={{ padding: "40px 0" }}>
                    <FileQuestion size={32} style={{ opacity: 0.4 }} />
                    <h3>No quizzes found</h3>
                    <p>Quizzes created by tutors will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((quiz) => (
                <tr key={quiz._id}>
                  <td style={{ fontWeight: 600 }}>
                    {quiz.title}
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-400)",
                        marginTop: 2,
                      }}
                    >
                      Lesson: {quiz.lesson?.title || "—"}
                    </div>
                  </td>
                  <td>{quiz.lesson?.course?.title || "—"}</td>
                  <td>{quiz.questions?.length || 0}</td>
                  <td>
                    <span className="ad-badge ad-badge--neutral">
                      {quiz.passMark}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="ad-btn ad-btn--ghost"
                        onClick={() => openEdit(quiz)}
                      >
                        <Edit2
                          size={14}
                          style={{ marginRight: 4, verticalAlign: "middle" }}
                        />
                        Edit
                      </button>
                      <button
                        className="ad-btn ad-btn--danger"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        <Trash2
                          size={14}
                          style={{ marginRight: 4, verticalAlign: "middle" }}
                        />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Pass Mark Modal */}
      {editing && (
        <div className="ad-modal-overlay" onClick={closeEdit}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2>Edit Pass Mark</h2>
              <button className="ad-modal-close" onClick={closeEdit}>
                ×
              </button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-form-group">
                <label>Quiz</label>
                <input
                  className="ad-input"
                  value={editing.title}
                  disabled
                  style={{ background: "#f8f6fa" }}
                />
              </div>
              <div className="ad-form-group">
                <label>Pass Mark (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="ad-input"
                  value={passMark}
                  onChange={(e) => setPassMark(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-btn ad-btn--ghost" onClick={closeEdit}>
                Cancel
              </button>
              <button
                className="ad-btn ad-btn--primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
