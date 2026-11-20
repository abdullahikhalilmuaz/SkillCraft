import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // ✅ FIX: track which row is updating

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      // ✅ FIX: guard against unexpected response shape
      setStudents(Array.isArray(res.data?.students) ? res.data.students : []);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    // ✅ FIX: surface errors instead of silently swallowing them
    setBusyId(id);
    try {
      await api.put(`/admin/students/${id}/status`, {
        isApproved: !currentStatus,
      });
      await fetchStudents();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(
        err.response?.data?.message ||
          "Failed to update student status. Please try again.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const filtered = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="ad-header">
        <h1>Manage Students</h1>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search">
          <Search size={16} color="#9c93a8" />
          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4">No students found.</td>
              </tr>
            ) : (
              filtered.map((student) => {
                const isBusy = busyId === student._id;
                return (
                  <tr key={student._id}>
                    <td style={{ fontWeight: 600 }}>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span
                        className={`ad-badge ${
                          student.isApproved
                            ? "ad-badge--success"
                            : "ad-badge--danger"
                        }`}
                      >
                        {student.isApproved ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`ad-btn ${
                          student.isApproved
                            ? "ad-btn--danger"
                            : "ad-btn--success"
                        }`}
                        onClick={() =>
                          toggleStatus(student._id, student.isApproved)
                        }
                        disabled={isBusy} // ✅ FIX: prevent double-clicks
                      >
                        {isBusy
                          ? "Updating..."
                          : student.isApproved
                            ? "Suspend"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}