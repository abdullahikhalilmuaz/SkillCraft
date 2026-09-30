import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function TutorApproval() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTutors = async () => {
    try {
      const res = await api.get("/admin/tutors/pending");
      setTutors(res.data.tutors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTutors(); }, []);

  const handleApproval = async (id, isApproved) => {
    try {
      await api.put(`/admin/tutors/${id}/status`, { isApproved });
      fetchTutors();
    } catch (err) {
      console.error("Failed to update tutor status", err);
    }
  };

  return (
    <div>
      <div className="ad-header">
        <h1>Tutor Approvals</h1>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4">Loading...</td></tr>
            ) : tutors.length === 0 ? (
              <tr><td colSpan="4">No pending tutor applications.</td></tr>
            ) : (
              tutors.map((tutor) => (
                <tr key={tutor._id}>
                  <td style={{ fontWeight: 600 }}>{tutor.name}</td>
                  <td>{tutor.email}</td>
                  <td>{new Date(tutor.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="ad-btn ad-btn--success" onClick={() => handleApproval(tutor._id, true)}>
                        Approve
                      </button>
                      <button className="ad-btn ad-btn--danger" onClick={() => handleApproval(tutor._id, false)}>
                        Reject
                      </button>
                    </div>
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