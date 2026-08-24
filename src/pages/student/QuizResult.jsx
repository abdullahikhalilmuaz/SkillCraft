import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "../../styles/quizresult.css";
import { GraduationCap, RotateCcw } from "lucide-react";
import api from "../../services/api";

export default function QuizResult() {
  const { quizId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        // If result was passed via navigation state
        if (location.state?.result) {
          setResult(location.state.result);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API (if backend stores results)
        // Note: Current backend doesn't have a GET endpoint for quiz results
        // This would need to be added or we rely on state
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

        <div className="qr-actions">
          <Link to="/student/dashboard" className="qr-btn qr-btn--primary">
            Continue Course
          </Link>
          <Link
            to={`/student/quiz/${quizId || "1"}`}
            className="qr-btn qr-btn--outline"
          >
            <RotateCcw size={15} />
            Review Answers
          </Link>
        </div>
      </div>
    </div>
  );
}
