import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/mycourses.css";
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
} from "lucide-react";
import api from "../../services/api";

const summary = [
  { icon: BookOpen, value: "4", label: "Enrolled Courses" },
  { icon: CheckCircle2, value: "2", label: "Completed Courses" },
  { icon: Clock, value: "18", label: "Hours Spent" },
  { icon: Award, value: "3", label: "Certificates Earned" },
];

export default function MyCourses() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("recent");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const response = await api.get("/learning/my-courses");
        const enrollments = response.data.enrollments || [];

        const formattedCourses = enrollments.map((enrollment) => ({
          id: enrollment.course?._id || enrollment.course?.id,
          title: enrollment.course?.title || "Untitled Course",
          tutor: enrollment.course?.instructor?.name || "Tutor",
          progress: enrollment.progress || 0,
          updatedAt: enrollment.updatedAt,
          image:
            enrollment.course?.image ||
            "https://picsum.photos/seed/default/200/200",
        }));

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const displayedCourses = (() => {
    const filtered = courses.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const list = [...filtered];
    switch (sortBy) {
      case "title":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case "progress":
        return list.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      default:
        return list;
    }
  })();

  return (
    <div className="mc-page">
      <main className="mc-main">
        {/* Page heading + breadcrumb */}
        <div className="mc-heading">
          <h1>My Learning</h1>
          <div className="mc-breadcrumb">
            <Link to="/student/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <span>My Learning</span>
          </div>
        </div>

        {/* Body: courses + sidebar */}
        <div className="mc-body-grid">
          <div className="mc-courses-col">
            {/* Search + sort */}
            <div className="mc-toolbar">
              <div className="mc-search">
                <Search size={16} className="mc-search-icon" />
                <input
                  type="text"
                  placeholder="Search my courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mc-sort">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Sort by: Recent</option>
                  <option value="title">Title (A–Z)</option>
                  <option value="progress">Progress</option>
                </select>
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Course list */}
            {loading ? (
              <p className="mc-empty">Loading your courses...</p>
            ) : error ? (
              <p className="mc-empty">{error}</p>
            ) : displayedCourses.length === 0 ? (
              <p className="mc-empty">
                {searchTerm
                  ? "No courses match your search."
                  : "You haven't enrolled in any courses yet."}
              </p>
            ) : (
              <ul className="mc-course-list">
                {displayedCourses.map((course) => (
                  <li className="mc-course-card" key={course.id}>
                    <img
                      src={course.image}
                      alt={course.title}
                      className="mc-course-thumb"
                    />
                    <div className="mc-course-info">
                      <p className="mc-course-title">{course.title}</p>
                      <p className="mc-course-tutor">{course.tutor}</p>
                      <div className="mc-progress-row">
                        <div className="mc-progress-track">
                          <div
                            className="mc-progress-fill"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="mc-progress-label">
                          {course.progress}% Complete
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/student/learn/${course.id}/1`}
                      className="mc-btn mc-btn--primary mc-continue-btn"
                    >
                      Continue
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sidebar */}
          <div className="mc-sidebar-col">
            <div className="mc-panel mc-keep-learning">
              <h2 className="mc-panel-title">Keep Learning!</h2>
              <p className="mc-keep-learning-text">
                Complete your courses and earn certificates to boost your
                skills.
              </p>
              <div className="mc-keep-learning-art" aria-hidden="true">
                <GraduationCap size={56} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
