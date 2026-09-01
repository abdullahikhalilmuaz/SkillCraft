import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "../../styles/quizresult.css";
import {
  GraduationCap,
  RotateCcw,
  Home,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import api from "../../services/api";

export default function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        if (location.state?.result) {
          setResult(location.state.result);
          setLoading(false);

          // Get AI recommendation after quiz
          await fetchAiRecommendation();
          return;
        }

        setError("No result data available.");
      } catch (err) {
        console.error("Failed to fetch quiz result:", err);
        setError(err.response?.data?.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId, location]);

  const fetchAiRecommendation = async () => {
    try {
      setAiLoading(true);

      // Get user's learning data
      const enrollResponse = await api.get("/learning/my-courses");
      const enrollments = enrollResponse.data.enrollments || [];

      if (enrollments.length === 0) return;

      // Filter enrollments with progress > 0
      const activeEnrollments = enrollments.filter((e) => e.progress > 0);

      if (activeEnrollments.length === 0) {
        setAiLoading(false);
        return;
      }

      // Calculate aggregated stats from ACTIVE enrollments only
      const totalLessons = activeEnrollments.reduce(
        (sum, e) => sum + (e.course?.lessons || 0),
        0,
      );
      const totalCompleted = activeEnrollments.reduce(
        (sum, e) => sum + (e.completedLessons?.length || 0),
        0,
      );
      const totalQuizzesAttempted = activeEnrollments.reduce(
        (sum, e) => sum + (e.quizzesAttempted || 0),
        0,
      );
      const totalTimeSpent = activeEnrollments.reduce(
        (sum, e) => sum + (e.timeSpent || 0),
        0,
      );
      const avgScore =
        activeEnrollments.length > 0
          ? Math.round(
              activeEnrollments.reduce(
                (sum, e) => sum + (e.averageScore || 0),
                0,
              ) / activeEnrollments.length,
            )
          : 0;
      const avgProgress =
        activeEnrollments.length > 0
          ? Math.round(
              activeEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) /
                activeEnrollments.length,
            )
          : 0;

      const aiPayload = {
        lessonsCompleted: totalCompleted,
        totalLessons: totalLessons || 8,
        timeSpent: totalTimeSpent,
        quizzesAttempted: totalQuizzesAttempted,
        averageScore: avgScore,
        completionRate: avgProgress,
        progress: avgProgress,
      };

      const aiResponse = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aiPayload),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        setAiRecommendation(aiData);
      }
    } catch (aiErr) {
      console.error("Failed to get AI recommendation:", aiErr);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="qr-page">
        <p>Loading result...</p>
      </div>
    );
  if (error)
    return (
      <div className="qr-page">
        <p>{error}</p>
      </div>
    );

  const correctCount = result?.correct || 0;
  const totalCount = result?.total || 0;
  const percent =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const getMessage = (pct) => {
    if (pct >= 90) return "Excellent work!";
    if (pct >= 70) return "Great job!";
    if (pct >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="qr-page">
      <div className="qr-sparkle qr-sparkle--1" aria-hidden="true" />
      <div className="qr-sparkle qr-sparkle--2" aria-hidden="true" />
      <div className="qr-sparkle qr-sparkle--3" aria-hidden="true" />

      <div className="qr-card">
        <div className="qr-icon-wrap">
          <GraduationCap size={40} className="qr-icon" />
        </div>

        <h1 className="qr-heading">Quiz Completed!</h1>

        <p className="qr-score">
          {correctCount} / {totalCount}
        </p>
        <p className="qr-percent">{percent}%</p>

        <p className="qr-message">{getMessage(percent)}</p>

        {/* AI Recommendation */}
        {aiLoading && <p className="qr-ai-loading">Getting AI insight...</p>}
        {aiRecommendation && (
          <div className="qr-ai-card">
            <p className="qr-ai-level">
              🧠 Your skill level:{" "}
              <strong>{aiRecommendation.skillLevel}</strong>
            </p>
            <p className="qr-ai-recommendation">
              {aiRecommendation.recommendation}
            </p>
          </div>
        )}

        <div className="qr-actions">
          {/* <Link to="/student/dashboard" className="qr-btn qr-btn--primary">
            <Home size={16} />
            Dashboard
          </Link> */}
          <Link to="/student/courses" className="qr-btn qr-btn--primary">
            <BookOpen size={16} />
            My Learning
          </Link>
          <Link to="/student/quizzes" className="qr-btn qr-btn--outline">
            <ClipboardList size={16} />
            All Quizzes
          </Link>
          {/* <Link
            to={`/student/quiz/${quizId || "1"}`}
            className="qr-btn qr-btn--outline"
          >
            <RotateCcw size={15} />
            Review Answers
          </Link> */}
        </div>
      </div>
    </div>
  );
}
