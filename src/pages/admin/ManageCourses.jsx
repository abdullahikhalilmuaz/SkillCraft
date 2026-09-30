import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../../services/api";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const togglePublish = async (id) => {
    try {
      await api.patch(`/admin/courses/${id}/publish`);
      fetchCourses();
    } catch (err) {
      console.error("Failed to toggle publish", err);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course", err);
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="ad-header">
        <h1>Manage Courses</h1>
      </div>

      <div className="ad-toolbar">
        <div className="ad-search">
          <Search size={16} color="#9c93a8" />
          <input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Tutor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5">No courses found.</td>
              </tr>
            ) : (
              filtered.map((course) => (
                <tr key={course._id}>
                  <td style={{ fontWeight: 600 }}>{course.title}</td>
                  <td>{course.instructor?.name || "Unknown"}</td>
                  <td>{course.students || 0}</td>
                  <td>
                    <span
                      className={`ad-badge ${course.published ? "ad-badge--success" : "ad-badge--neutral"}`}
                    >
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className={`ad-btn ${course.published ? "ad-btn--ghost" : "ad-btn--success"}`}
                        onClick={() => togglePublish(course._id)}
                      >
                        {course.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        className="ad-btn ad-btn--danger"
                        onClick={() => deleteCourse(course._id)}
                      >
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
    </div>
  );
}
