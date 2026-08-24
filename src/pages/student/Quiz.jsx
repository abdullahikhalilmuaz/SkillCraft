import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/quiz.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

export default function Quiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/quizzes/${quizId}`);
        const quiz = response.data.quiz;
        setQuizTitle(quiz.title || "Quiz");
        setQuestions(quiz.questions || []);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load quiz. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      
      // Format answers as { index: selectedOption } for backend
      const formattedAnswers = {};
      questions.forEach((q, index) => {
        if (answers[q._id] !== undefined) {
          formattedAnswers[index] = answers[q._id];
        }
      });

      const response = await api.post(`/learning/quiz/${quizId}/submit`, {
        answers: formattedAnswers,
        timeSpent: 0, // Could track time spent if needed
      });

      const result = response.data.result;
      
      // Navigate to result page with data
      navigate(`/student/quiz/${quizId}/result`, { 
        state: { 
          result: {
            correct: result.correct,
            total: result.total,
            score: result.score,
            passed: result.passed,
            passMark: result.passMark
          }
        } 
      });
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError(err.response?.data?.message || "Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="qz-page">
        <p>Loading quiz...</p>
      </div>
    );
  if (error)
    return (
      <div className="qz-page">
        <p>{error}</p>
      </div>
    );
  if (questions.length === 0)
    return (
      <div className="qz-page">
        <p>No questions found for this quiz.</p>
      </div>
    );

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const selectedOption = answers[question._id];

  const handleSelect = (optionId) => {
    setAnswers((prev) => ({ ...prev, [question._id]: optionId }));
  };

  const handlePrevious = () => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  return (
    <div className="qz-page">
      <div className="qz-container">
        {/* Top row */}
        <div className="qz-topbar">
          <Link to="/student/dashboard" className="qz-back-link">
            <ChevronLeft size={16} />
            Back to Course
          </Link>
          <span className="qz-counter">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="qz-progress-track">
          <div
            className="qz-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question card */}
        <div className="qz-card">
          <p className="qz-question-label">Question {currentIndex + 1}</p>
          <h1 className="qz-question-text">{question.question}</h1>

          <div className="qz-options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`qz-option ${
                  selectedOption === index ? "qz-option--selected" : ""
                }`}
                onClick={() => handleSelect(index)}
                disabled={submitting}
              >
                <span className="qz-option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="qz-option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="qz-nav-row">
          <button
            className="qz-btn qz-btn--outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || submitting}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button
            className="qz-btn qz-btn--primary"
            onClick={handleNext}
            disabled={!selectedOption || submitting}
          >
            {submitting 
              ? "Submitting..." 
              : currentIndex === totalQuestions - 1
                ? "Finish Quiz"
                : "Next Question"}
            {!submitting && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}