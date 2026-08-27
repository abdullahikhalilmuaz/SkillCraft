import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/studentquizzes.css";
import {
  ClipboardList,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileQuestion,
  BookOpen,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch enrolled courses
        const enrollRes = await api.get("/learning/my-courses");
        const enrollments = enrollRes.data.enrollments || [];
        setEnrolledCourses(enrollments);

        if (enrollments.length === 0) {
          setQuizzes([]);
          setLoading(false);
          return;
        }

        // Fetch all quizzes
        const quizzesRes = await api.get("/quizzes");
        const allQuizzes = quizzesRes.data.quizzes || [];

        // Get enrolled course IDs
        const enrolledCourseIds = enrollments
          .map((e) => e.course?._id || e.course?.id)
          .filter(Boolean);

        // Filter quizzes: only show quizzes for lessons in enrolled courses
        const filteredQuizzes = allQuizzes.filter((q) => {
          const courseId = q.lesson?.course?._id || q.lesson?.course;
          return enrolledCourseIds.includes(courseId);
        });

        // Format quizzes for display
        const formattedQuizzes = filteredQuizzes.map((q) => ({
          id: q._id,
          title: q.title || "Untitled Quiz",
          lesson: q.lesson?.title || "Lesson",
          course: q.lesson?.course?.title || "Course",
          courseId: q.lesson?.course?._id || q.lesson?.course,
          questionCount: q.questions?.length || 0,
          passMark: q.passMark || 50,
          createdAt: new Date(q.createdAt).toLocaleDateString(),
        }));

        setQuizzes(formattedQuizzes);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError(err.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="sq-page">
        <div className="sq-container">
          <div className="sq-loading-cube">
            <div className="sq-cube">
              <div className="sq-cube-face sq-cube-face-front"></div>
              <div className="sq-cube-face sq-cube-face-back"></div>
              <div className="sq-cube-face sq-cube-face-right"></div>
              <div className="sq-cube-face sq-cube-face-left"></div>
              <div className="sq-cube-face sq-cube-face-top"></div>
              <div className="sq-cube-face sq-cube-face-bottom"></div>
            </div>
            <p className="sq-loading-text">Loading your quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sq-page">
      <div className="sq-container">
        <div className="sq-header">
          <h1 className="sq-title">
            <ClipboardList size={28} className="sq-title-icon" />
            My Quizzes
          </h1>
          <p className="sq-subtitle">
            Complete quizzes to test your knowledge and track your progress.
          </p>
        </div>

        {error && (
          <div className="sq-error">
            <p>{error}</p>
          </div>
        )}

        {enrolledCourses.length === 0 ? (
          <div className="sq-empty">
            <BookOpen size={48} className="sq-empty-icon" />
            <p>No courses enrolled yet.</p>
            <p className="sq-empty-sub">
              Enroll in a course to unlock quizzes.
            </p>
            <Link
              to="/courses"
              className="sq-btn sq-btn--primary sq-btn--empty"
            >
              Browse Courses
            </Link>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="sq-empty">
            <Sparkles size={48} className="sq-empty-icon" />
            <p>No quizzes available right now.</p>
            <p className="sq-empty-sub">
              Quizzes will appear here once your tutors create them.
            </p>
          </div>
        ) : (
          <div className="sq-grid">
            {quizzes.map((quiz) => (
              <div className="sq-card" key={quiz.id}>
                <div className="sq-card-header">
                  <h3 className="sq-card-title">{quiz.title}</h3>
                  <span className="sq-card-badge">
                    {quiz.questionCount} Questions
                  </span>
                </div>

                <div className="sq-card-body">
                  <div className="sq-card-meta">
                    <span className="sq-card-lesson">
                      <ChevronRight size={14} />
                      {quiz.lesson}
                    </span>
                    <span className="sq-card-course">{quiz.course}</span>
                  </div>

                  <div className="sq-card-stats">
                    <span className="sq-card-passmark">
                      Pass Mark: {quiz.passMark}%
                    </span>
                    <span className="sq-card-date">{quiz.createdAt}</span>
                  </div>
                </div>

                <div className="sq-card-footer">
                  <Link
                    to={`/student/quiz/${quiz.id}`}
                    className="sq-btn sq-btn--primary"
                  >
                    Take Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
