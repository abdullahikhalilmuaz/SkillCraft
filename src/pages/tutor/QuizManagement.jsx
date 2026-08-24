import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/quizmanagement.css";
import {
  ChevronRight,
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  ClipboardList,
  HelpCircle,
  Target,
  Bell,
  Trash2,
  X,
} from "lucide-react";
import api from "../../services/api";

const filterTabs = ["All Quizzes", "Published", "Drafts"];

const statusClassMap = {
  Published: "qm-status--published",
  Draft: "qm-status--draft",
};

const emptyQuestion = () => ({
  id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  question: "",
  options: ["", "", "", ""],
  answer: 0,
});

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState([
    { icon: ClipboardList, value: "0", label: "Total Quizzes" },
    { icon: HelpCircle, value: "0", label: "Total Questions" },
    { icon: Target, value: "0%", label: "Average Pass Mark" },
    { icon: ChevronRight, value: "0", label: "Attempts This Month" },
  ]);
  const [activeFilter, setActiveFilter] = useState("All Quizzes");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Builder state
  const [formTitle, setFormTitle] = useState("");
  const [formLessonId, setFormLessonId] = useState("");
  const [formPassMark, setFormPassMark] = useState(50);
  const [formQuestions, setFormQuestions] = useState([emptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch tutor's courses and their quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch tutor's courses
        const coursesRes = await api.get("/courses/tutor/my-courses");
        const tutorCourses = coursesRes.data.courses || [];

        // Fetch lessons for each course
        let allLessons = [];
        for (const course of tutorCourses) {
          try {
            const lessonsRes = await api.get(`/lessons/course/${course._id}`);
            const courseLessons = (lessonsRes.data.lessons || []).map((l) => ({
              ...l,
              courseId: course._id,
              courseTitle: course.title,
            }));
            allLessons = [...allLessons, ...courseLessons];
          } catch (e) {
            console.error(
              `Failed to fetch lessons for course ${course._id}:`,
              e,
            );
          }
        }

        setLessons(allLessons);

        // Note: Backend doesn't have GET /api/quizzes endpoint yet
        // Using mock data for now - would be replaced with actual API call
        const mockQuizzes = allLessons.map((lesson, index) => ({
          id: `q-${index}`,
          title: `${lesson.title} Quiz`,
          lesson: lesson.title,
          course: lesson.courseTitle,
          questionCount: 5,
          passMark: 60,
          status: index % 2 === 0 ? "Published" : "Draft",
          updated: new Date().toLocaleDateString(),
          _id: `quiz-${index}`,
        }));

        setQuizzes(mockQuizzes);

        // Update stats
        const totalQuizzes = mockQuizzes.length;
        const totalQuestions = mockQuizzes.reduce(
          (sum, q) => sum + q.questionCount,
          0,
        );
        const avgPassMark =
          totalQuizzes > 0
            ? Math.round(
                mockQuizzes.reduce((sum, q) => sum + q.passMark, 0) /
                  totalQuizzes,
              )
            : 0;

        setStats([
          {
            icon: ClipboardList,
            value: String(totalQuizzes),
            label: "Total Quizzes",
          },
          {
            icon: HelpCircle,
            value: String(totalQuestions),
            label: "Total Questions",
          },
          {
            icon: Target,
            value: `${avgPassMark}%`,
            label: "Average Pass Mark",
          },
          { icon: ChevronRight, value: "0", label: "Attempts This Month" },
        ]);
      } catch (err) {
        console.error("Failed to fetch quiz data:", err);
        setError(err.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesFilter =
      activeFilter === "All Quizzes" ||
      quiz.status === activeFilter.replace(/s$/, "");
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openBuilder = () => {
    setFormTitle("");
    setFormLessonId(lessons[0]?._id || "");
    setFormPassMark(50);
    setFormQuestions([emptyQuestion()]);
    setBuilderOpen(true);
  };

  const updateQuestionText = (id, value) => {
    setFormQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, question: value } : q)),
    );
  };

  const updateOptionText = (qId, optIndex, value) => {
    setFormQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((o, i) => (i === optIndex ? value : o)),
            }
          : q,
      ),
    );
  };

  const setCorrectAnswer = (qId, optIndex) => {
    setFormQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, answer: optIndex } : q)),
    );
  };

  const addQuestion = () => {
    setFormQuestions((prev) => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (id) => {
    setFormQuestions((prev) =>
      prev.length > 1 ? prev.filter((q) => q.id !== id) : prev,
    );
  };

  const saveQuiz = async (status) => {
    if (!formLessonId) {
      setError("Please select a lesson.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formTitle || "Untitled Quiz",
        questions: formQuestions.filter((q) => q.question.trim()),
        passMark: Number(formPassMark),
      };

      const response = await api.post(
        `/quizzes/lesson/${formLessonId}`,
        payload,
      );

      const newQuiz = {
        id: response.data.quiz._id,
        title: response.data.quiz.title,
        lesson: lessons.find((l) => l._id === formLessonId)?.title || "Lesson",
        course:
          lessons.find((l) => l._id === formLessonId)?.courseTitle || "Course",
        questionCount: response.data.quiz.questions.length,
        passMark: response.data.quiz.passMark,
        status: status,
        updated: "Updated just now",
        _id: response.data.quiz._id,
      };

      setQuizzes((prev) => [newQuiz, ...prev]);
      setBuilderOpen(false);
      setError("");
    } catch (err) {
      console.error("Failed to create quiz:", err);
      setError(err.response?.data?.message || "Failed to create quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuiz = async (id) => {
    // Note: DELETE /api/quizzes/:id endpoint doesn't exist in backend yet
    // For now, just remove from local state
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    setOpenMenuId(null);
  };

  if (loading)
    return (
      <div className="qm-page">
        <p>Loading quizzes...</p>
      </div>
    );
  if (error)
    return (
      <div className="qm-page">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="qm-page">
      {/* Navbar */}
      <header className="qm-navbar">
        <div className="qm-navbar-left">
          <span className="qm-logo-mark">◆</span>
          <span className="qm-logo-text">SkillCraft</span>
        </div>

        <nav className="qm-nav-links">
          <Link to="/" className="qm-nav-link">
            Home
          </Link>
          <Link to="/courses" className="qm-nav-link">
            Courses
          </Link>
          <Link
            to="/tutor/dashboard"
            className="qm-nav-link qm-nav-link--active"
          >
            Tutors
          </Link>
          <Link to="/about" className="qm-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="qm-nav-link">
            Contact
          </Link>
        </nav>

        <div className="qm-navbar-right">
          <button className="qm-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="qm-icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="qm-notif-dot" />
          </button>
          <Link to="/login" className="qm-btn qm-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="qm-btn qm-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="qm-main">
        {/* Heading */}
        <div className="qm-heading-row">
          <div>
            <h1>Quiz Management</h1>
            <div className="qm-breadcrumb">
              <Link to="/tutor/dashboard">Home</Link>
              <ChevronRight size={14} />
              <Link to="/tutor/dashboard">Tutor</Link>
              <ChevronRight size={14} />
              <span>Quizzes</span>
            </div>
          </div>
          <button className="qm-btn qm-btn--primary" onClick={openBuilder}>
            <Plus size={16} />
            Create Quiz
          </button>
        </div>

        {/* Stats */}
        <section className="qm-stats">
          {stats.map(({ icon: Icon, value, label }) => (
            <div className="qm-stat-card" key={label}>
              <div className="qm-stat-icon">
                <Icon size={20} />
              </div>
              <div>
                <p className="qm-stat-value">{value}</p>
                <p className="qm-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Filter tabs + search */}
        <div className="qm-toolbar">
          <div className="qm-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                className={`qm-filter-tab ${activeFilter === tab ? "qm-filter-tab--active" : ""}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="qm-toolbar-right">
            <div className="qm-search">
              <Search size={15} className="qm-search-icon" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="qm-sort">
              <span>Sort by: Recent</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        {/* Quiz table */}
        <div className="qm-table-wrap">
          <table className="qm-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Lesson</th>
                <th>Questions</th>
                <th>Pass Mark</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <div className="qm-quiz-cell">
                      <p className="qm-quiz-title">{quiz.title}</p>
                      <p className="qm-quiz-updated">{quiz.updated}</p>
                    </div>
                  </td>
                  <td>
                    <p className="qm-lesson-name">{quiz.lesson}</p>
                    <p className="qm-lesson-course">{quiz.course}</p>
                  </td>
                  <td>{quiz.questionCount} Questions</td>
                  <td>{quiz.passMark}%</td>
                  <td>
                    <span
                      className={`qm-status ${statusClassMap[quiz.status]}`}
                    >
                      {quiz.status}
                    </span>
                  </td>
                  <td className="qm-actions-cell">
                    <button
                      className="qm-menu-btn"
                      onClick={() => toggleMenu(quiz.id)}
                      aria-label="More actions"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenuId === quiz.id && (
                      <div className="qm-menu">
                        <button type="button">Edit Quiz</button>
                        <button type="button">Preview</button>
                        <button type="button">View Results</button>
                        <button
                          type="button"
                          className="qm-menu-danger"
                          onClick={() => deleteQuiz(quiz.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredQuizzes.length === 0 && (
                <tr>
                  <td colSpan={6} className="qm-empty-row">
                    No quizzes match your filters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="qm-mobile-list">
            {filteredQuizzes.map((quiz) => (
              <div className="qm-mobile-card" key={quiz.id}>
                <p className="qm-quiz-title">{quiz.title}</p>
                <p className="qm-lesson-course">{quiz.course}</p>
                <div className="qm-mobile-meta">
                  <span>{quiz.questionCount} Questions</span>
                  <span>Pass: {quiz.passMark}%</span>
                </div>
                <span className={`qm-status ${statusClassMap[quiz.status]}`}>
                  {quiz.status}
                </span>
                <div className="qm-mobile-actions">
                  <button className="qm-btn qm-btn--outline">Edit</button>
                  <button
                    className="qm-btn qm-btn--outline"
                    onClick={() => deleteQuiz(quiz.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Quiz builder panel */}
      {builderOpen && (
        <div className="qm-builder-overlay" role="dialog" aria-modal="true">
          <div className="qm-builder-panel">
            <div className="qm-builder-header">
              <h2>Create Quiz</h2>
              <button
                className="qm-icon-btn"
                aria-label="Close"
                onClick={() => setBuilderOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="qm-builder-body">
              <div className="qm-field">
                <label htmlFor="quizTitle">Quiz Title</label>
                <input
                  id="quizTitle"
                  type="text"
                  placeholder="e.g. Ingredients Fundamentals"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>

              <div className="qm-field-row">
                <div className="qm-field">
                  <label htmlFor="quizLesson">Attach to Lesson</label>
                  <div className="qm-select-wrap">
                    <select
                      id="quizLesson"
                      value={formLessonId}
                      onChange={(e) => setFormLessonId(e.target.value)}
                    >
                      <option value="">Select a lesson</option>
                      {lessons.map((lesson) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.title} — {lesson.courseTitle}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="qm-select-icon" />
                  </div>
                </div>

                <div className="qm-field qm-field--narrow">
                  <label htmlFor="passMark">Pass Mark (%)</label>
                  <input
                    id="passMark"
                    type="number"
                    min="0"
                    max="100"
                    value={formPassMark}
                    onChange={(e) => setFormPassMark(e.target.value)}
                  />
                </div>
              </div>

              <div className="qm-questions">
                {formQuestions.map((q, qIndex) => (
                  <div className="qm-question-card" key={q.id}>
                    <div className="qm-question-card__header">
                      <span>Question {qIndex + 1}</span>
                      <button
                        type="button"
                        className="qm-icon-action qm-icon-action--danger"
                        onClick={() => removeQuestion(q.id)}
                        aria-label="Remove question"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Enter question text"
                      value={q.question}
                      onChange={(e) => updateQuestionText(q.id, e.target.value)}
                      className="qm-question-input"
                    />

                    <div className="qm-options-grid">
                      {q.options.map((opt, optIndex) => (
                        <label
                          className={`qm-option-row ${
                            q.answer === optIndex
                              ? "qm-option-row--correct"
                              : ""
                          }`}
                          key={optIndex}
                        >
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.answer === optIndex}
                            onChange={() => setCorrectAnswer(q.id, optIndex)}
                          />
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            value={opt}
                            onChange={(e) =>
                              updateOptionText(q.id, optIndex, e.target.value)
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <p className="qm-question-hint">
                      Select the radio button next to the correct answer.
                    </p>
                  </div>
                ))}

                <button
                  type="button"
                  className="qm-btn qm-btn--outline qm-btn--block"
                  onClick={addQuestion}
                >
                  <Plus size={16} />
                  Add Question
                </button>
              </div>
            </div>

            <div className="qm-builder-footer">
              <button
                className="qm-btn qm-btn--outline"
                onClick={() => saveQuiz("Draft")}
                disabled={submitting}
              >
                Save as Draft
              </button>
              <button
                className="qm-btn qm-btn--primary"
                onClick={() => saveQuiz("Published")}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Publish Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
