import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/learning.css";
import {
  ChevronRight,
  Play,
  Volume2,
  Settings as SettingsIcon,
  Maximize,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import api from "../../services/api";

const tabs = ["Overview", "Notes", "Resources", "Discussion"];

export default function Learning() {
  const { courseId, lessonId } = useParams();
  const [activeTab, setActiveTab] = React.useState("Overview");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course details
        const courseRes = await api.get(`/courses/${courseId}`);
        setCourse(courseRes.data.course);

        // Fetch lessons
        const lessonsRes = await api.get(`/lessons/course/${courseId}`);
        const fetchedLessons = lessonsRes.data.lessons || [];
        setLessons(fetchedLessons);

        // Calculate progress from enrollment
        try {
          const enrollRes = await api.get("/learning/my-courses");
          const enrollment = enrollRes.data.enrollments?.find(
            (e) => e.course?._id === courseId || e.course?.id === courseId,
          );
          if (enrollment) setProgress(enrollment.progress || 0);
        } catch (e) {
          // Silently fail - progress stays 0
        }
      } catch (err) {
        console.error("Failed to fetch learning data:", err);
        setError(
          err.response?.data?.message || "Failed to load course content.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const currentLesson = lessons.find((l) => l._id === lessonId) ||
    lessons[0] || { id: 1, title: "Loading...", duration: "0 min" };

  if (loading)
    return (
      <div className="lp-page">
        <p>Loading lesson...</p>
      </div>
    );
  if (error)
    return (
      <div className="lp-page">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="lp-page">
      {/* Top bar */}
      <header className="lp-topbar">
        <div className="lp-topbar-left">
          <span className="lp-logo-mark">◆</span>
          <span className="lp-logo-text">SkillCraft</span>
        </div>
        <div className="lp-breadcrumb">
          <Link to="/student/courses">My Learning</Link>
          <ChevronRight size={13} />
          <span>{course?.title || "Course"}</span>
          <ChevronRight size={13} />
          <span className="lp-breadcrumb-current">{currentLesson.title}</span>
        </div>
        <Link to="/student/dashboard" className="lp-exit-link">
          Exit Course
        </Link>
      </header>

      <div className="lp-body">
        {/* Main column */}
        <main className="lp-main">
          {/* Video player */}
          <div className="lp-video">
            <button className="lp-play-btn" aria-label="Play video">
              <Play size={26} fill="currentColor" />
            </button>
            <div className="lp-video-controls">
              <button aria-label="Play">
                <Play size={16} fill="currentColor" />
              </button>
              <div className="lp-video-track">
                <div className="lp-video-progress" style={{ width: "38%" }} />
              </div>
              <button aria-label="Volume">
                <Volume2 size={16} />
              </button>
              <button aria-label="Settings">
                <SettingsIcon size={16} />
              </button>
              <button aria-label="Fullscreen">
                <Maximize size={16} />
              </button>
            </div>
          </div>

          {/* Lesson info */}
          <div className="lp-lesson-header">
            <h1>
              Lesson {currentLesson.order || 1}: {currentLesson.title}
            </h1>
            <p className="lp-lesson-meta">
              {currentLesson.duration || "0 min"} • Lesson{" "}
              {currentLesson.order || 1} of {lessons.length}
            </p>
          </div>

          <div className="lp-lesson-actions">
            <button className="lp-btn lp-btn--outline">
              <ChevronLeft size={16} />
              Previous Lesson
            </button>
            <button className="lp-btn lp-btn--primary">Mark as Complete</button>
            <button className="lp-btn lp-btn--outline">
              Next Lesson
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="lp-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`lp-tab ${
                  activeTab === tab ? "lp-tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="lp-tabs-divider" />

          <div className="lp-tab-content">
            {activeTab === "Overview" && (
              <div>
                <h2>About This Lesson</h2>
                <p>
                  {currentLesson.description ||
                    "No description available for this lesson."}
                </p>
              </div>
            )}
            {activeTab === "Notes" && (
              <div>
                <h2>Your Notes</h2>
                <p>You haven&rsquo;t added any notes for this lesson yet.</p>
              </div>
            )}
            {activeTab === "Resources" && (
              <div>
                <h2>Downloadable Resources</h2>
                <p>
                  {currentLesson.resources?.length > 0
                    ? "Resources are attached to this lesson."
                    : "No resources available for this lesson."}
                </p>
              </div>
            )}
            {activeTab === "Discussion" && (
              <div>
                <h2>Discussion</h2>
                <p>Ask a question or discuss this lesson with your tutor.</p>
              </div>
            )}
          </div>
        </main>

        {/* Curriculum sidebar */}
        <aside className="lp-sidebar">
          <div className="lp-sidebar-header">
            <h2>Course Curriculum</h2>
            <p className="lp-sidebar-progress-label">{progress}% Complete</p>
            <div className="lp-sidebar-progress-track">
              <div
                className="lp-sidebar-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="lp-curriculum">
            <div className="lp-curriculum-section">
              <div className="lp-section-header">
                <span>Lessons</span>
                <ChevronDown size={16} />
              </div>
              <ul className="lp-lesson-list">
                {lessons.map((lesson) => {
                  const isCurrent = lesson._id === currentLesson._id;
                  return (
                    <li
                      key={lesson._id}
                      className={`lp-lesson-item ${isCurrent ? "lp-lesson-item--current" : ""}`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2
                          size={16}
                          className="lp-lesson-icon lp-lesson-icon--done"
                        />
                      ) : isCurrent ? (
                        <span className="lp-lesson-dot" />
                      ) : (
                        <Circle size={16} className="lp-lesson-icon" />
                      )}
                      <Link
                        to={`/student/learn/${courseId}/${lesson._id}`}
                        className="lp-lesson-title"
                      >
                        {lesson.title}
                      </Link>
                      <span className="lp-lesson-duration">
                        {lesson.duration || "0 min"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
