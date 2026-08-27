import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../../styles/learning.css";
import {
  ChevronRight,
  Play,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronLeft,
  ClipboardList,
  Send,
  Trash2,
  MessageSquare,
  FileText,
  StickyNote,
} from "lucide-react";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authService";

const tabs = ["Overview", "Notes", "Discussion"];

export default function Learning() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [checkingQuiz, setCheckingQuiz] = useState(false);

  // Notes state
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // Discussion state
  const [discussions, setDiscussions] = useState([]);
  const [discussionMessage, setDiscussionMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const courseRes = await api.get(`/courses/${courseId}`);
        setCourse(courseRes.data.course);

        const lessonsRes = await api.get(`/lessons/course/${courseId}`);
        const fetchedLessons = lessonsRes.data.lessons || [];
        setLessons(fetchedLessons);

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
    lessons[0] || {
      _id: "1",
      title: "Loading...",
      duration: "0 min",
      content: "",
      videoUrl: "",
    };

  // Check if current lesson has a quiz
  useEffect(() => {
    const checkQuiz = async () => {
      if (!currentLesson?._id) return;

      setCheckingQuiz(true);
      try {
        const response = await api.get(`/quizzes/lesson/${currentLesson._id}`);
        if (response.data.quiz) {
          setHasQuiz(true);
          setQuizId(response.data.quiz._id);
        }
      } catch (err) {
        setHasQuiz(false);
        setQuizId(null);
      } finally {
        setCheckingQuiz(false);
      }
    };

    checkQuiz();
  }, [currentLesson]);

  // Load saved note
  useEffect(() => {
    const loadNote = async () => {
      if (!currentLesson?._id) return;
      try {
        const response = await api.get(`/notes/lesson/${currentLesson._id}`);
        if (response.data.note) {
          setSavedNote(response.data.note.content);
          setNote(response.data.note.content);
        }
      } catch (err) {
        // No note found
        setSavedNote("");
        setNote("");
      }
    };
    loadNote();
  }, [currentLesson]);

  // Load discussions
  useEffect(() => {
    const loadDiscussions = async () => {
      if (!currentLesson?._id || activeTab !== "Discussion") return;

      setLoadingDiscussions(true);
      try {
        const response = await api.get(
          `/discussions/lesson/${currentLesson._id}`,
        );
        setDiscussions(response.data.discussions || []);
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } catch (err) {
        console.error("Failed to load discussions:", err);
      } finally {
        setLoadingDiscussions(false);
      }
    };
    loadDiscussions();
  }, [currentLesson, activeTab]);

  const currentIndex = lessons.findIndex((l) => l._id === currentLesson._id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      const prevLesson = lessons[currentIndex - 1];
      navigate(`/student/learn/${courseId}/${prevLesson._id}`);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextLesson = lessons[currentIndex + 1];
      navigate(`/student/learn/${courseId}/${nextLesson._id}`);
    }
  };

  const markComplete = async () => {
    if (completing) return;

    setCompleting(true);
    try {
      await api.post(`/learning/lesson/${currentLesson._id}/complete`);

      setLessons((prev) =>
        prev.map((l) =>
          l._id === currentLesson._id ? { ...l, completed: true } : l,
        ),
      );

      try {
        const enrollRes = await api.get("/learning/my-courses");
        const enrollment = enrollRes.data.enrollments?.find(
          (e) => e.course?._id === courseId || e.course?.id === courseId,
        );
        if (enrollment) setProgress(enrollment.progress || 0);
      } catch (e) {
        // Silently fail
      }

      if (hasNext) {
        setTimeout(() => {
          goToNext();
        }, 800);
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      setError("Failed to mark lesson as complete.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCompleting(false);
    }
  };

  const goToQuiz = () => {
    if (quizId) {
      navigate(`/student/quiz/${quizId}`);
    }
  };

  // Notes functions
  const saveNote = async () => {
    if (!note.trim()) return;
    setSavingNote(true);
    setNoteSaved(false);
    try {
      await api.post(`/notes/lesson/${currentLesson._id}`, {
        content: note.trim(),
      });
      setSavedNote(note);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save note.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSavingNote(false);
    }
  };

  // Discussion functions
  const sendMessage = async () => {
    if (!discussionMessage.trim() || sendingMessage) return;
    setSendingMessage(true);
    try {
      const response = await api.post(
        `/discussions/lesson/${currentLesson._id}`,
        {
          message: discussionMessage.trim(),
        },
      );
      setDiscussions((prev) => [response.data.discussion, ...prev]);
      setDiscussionMessage("");
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(err.response?.data?.message || "Failed to send message.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSendingMessage(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/discussions/${id}`);
      setDiscussions((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
      setError("Failed to delete message.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("vimeo.com/")) {
      return url;
    }
    return url;
  };

  const videoEmbedUrl = getEmbedUrl(currentLesson.videoUrl);

  const renderContent = (content) => {
    if (!content) return <p>No content available for this lesson.</p>;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
      />
    );
  };

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
        <main className="lp-main">
          <div className="lp-video">
            {videoEmbedUrl ? (
              <video
                src={videoEmbedUrl}
                controls
                style={{ width: "100%", height: "100%", maxHeight: "450px" }}
                playsInline
              />
            ) : (
              <div className="lp-video-placeholder">
                <Play size={48} className="lp-play-icon" />
                <p>No video available for this lesson</p>
              </div>
            )}
          </div>

          <div className="lp-lesson-header">
            <h1>
              Lesson {currentIndex + 1}: {currentLesson.title}
            </h1>
            <p className="lp-lesson-meta">
              {currentLesson.duration || "0 min"} • Lesson {currentIndex + 1} of{" "}
              {lessons.length}
            </p>
          </div>

          <div className="lp-lesson-actions">
            <button
              className="lp-btn lp-btn--outline"
              onClick={goToPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft size={16} />
              Previous Lesson
            </button>
            <button
              className="lp-btn lp-btn--primary"
              onClick={markComplete}
              disabled={completing || currentLesson.completed}
            >
              {completing
                ? "Completing..."
                : currentLesson.completed
                  ? "✓ Completed"
                  : "Mark as Complete"}
            </button>
            {hasQuiz && quizId && (
              <button className="lp-btn lp-btn--secondary" onClick={goToQuiz}>
                <ClipboardList size={16} />
                Take Quiz
              </button>
            )}
            <button
              className="lp-btn lp-btn--outline"
              onClick={goToNext}
              disabled={!hasNext}
            >
              Next Lesson
              <ChevronRight size={16} />
            </button>
          </div>

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
                {renderContent(
                  currentLesson.content || currentLesson.description,
                )}
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="lp-notes-tab">
                <div className="lp-notes-header">
                  <h2>Your Notes</h2>
                  {noteSaved && <span className="lp-notes-saved">✓ Saved</span>}
                </div>
                <textarea
                  className="lp-notes-textarea"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write your notes for this lesson..."
                  rows={6}
                />
                <button
                  className="lp-btn lp-btn--primary"
                  onClick={saveNote}
                  disabled={savingNote || !note.trim()}
                >
                  {savingNote ? "Saving..." : "Save Notes"}
                </button>
                {savedNote && (
                  <div className="lp-notes-saved-preview">
                    <p className="lp-notes-saved-label">Last saved:</p>
                    <p className="lp-notes-saved-content">{savedNote}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Discussion" && (
              <div className="lp-discussion-tab">
                <div className="lp-discussion-input">
                  <textarea
                    className="lp-discussion-textarea"
                    value={discussionMessage}
                    onChange={(e) => setDiscussionMessage(e.target.value)}
                    placeholder="Ask a question or start a discussion..."
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <button
                    className="lp-btn lp-btn--primary lp-discussion-send"
                    onClick={sendMessage}
                    disabled={sendingMessage || !discussionMessage.trim()}
                  >
                    <Send size={16} />
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </div>

                {loadingDiscussions ? (
                  <p className="lp-discussion-loading">Loading messages...</p>
                ) : discussions.length === 0 ? (
                  <div className="lp-discussion-empty">
                    <MessageSquare size={40} />
                    <p>No discussions yet.</p>
                    <p className="lp-discussion-empty-sub">
                      Be the first to ask a question!
                    </p>
                  </div>
                ) : (
                  <div className="lp-discussion-list">
                    {discussions.map((disc) => (
                      <div key={disc._id} className="lp-discussion-item">
                        <div className="lp-discussion-avatar">
                          {disc.userName?.charAt(0) || "U"}
                        </div>
                        <div className="lp-discussion-content">
                          <div className="lp-discussion-header">
                            <span className="lp-discussion-author">
                              {disc.userName || "User"}
                            </span>
                            <span className="lp-discussion-time">
                              {new Date(disc.createdAt).toLocaleDateString()}{" "}
                              {new Date(disc.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="lp-discussion-message">
                            {disc.message}
                          </p>
                        </div>
                        {(disc.user?._id === currentUser?.id ||
                          currentUser?.role === "tutor" ||
                          currentUser?.role === "admin") && (
                          <button
                            className="lp-discussion-delete"
                            onClick={() => deleteMessage(disc._id)}
                            aria-label="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

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
                  const isCompleted = lesson.completed || false;
                  return (
                    <li
                      key={lesson._id}
                      className={`lp-lesson-item ${isCurrent ? "lp-lesson-item--current" : ""}`}
                    >
                      {isCompleted ? (
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
