import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/createcourse.css";
import {
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  GripVertical,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import api from "../../services/api";

const steps = [
  {
    number: 1,
    title: "Basic Information",
    description: "Course title, description, category",
  },
  {
    number: 2,
    title: "Curriculum",
    description: "Add sections and lessons",
  },
  {
    number: 3,
    title: "Pricing",
    description: "A price and enrollment options",
  },
  {
    number: 4,
    title: "Course Preview",
    description: "Review before publishing",
  },
];

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("English");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/courses/${courseId}`);
        const course = response.data.course;

        setTitle(course.title || "");
        setCategory(course.category || "");
        setLevel(course.level || "");
        setLanguage("English");
        setShortDescription(course.description?.split("\n\n")[0] || "");
        setFullDescription(
          course.description?.split("\n\n").slice(1).join("\n\n") || "",
        );
        setPrice(course.price || 0);
        setThumbnail(course.image || "");
        setLessons([]);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(err.response?.data?.message || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const removeLesson = (id) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const addLesson = () => {
    const nextId = `l${lessons.length + 1}-${Date.now()}`;
    setLessons((prev) => [
      ...prev,
      { id: nextId, title: "New Lesson", duration: "0 min" },
    ]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const description = `${shortDescription.trim()}\n\n${fullDescription.trim()}`;

      await api.put(`/courses/${courseId}`, {
        title,
        category,
        level,
        description,
        image: thumbnail,
      });

      navigate("/tutor/courses");
    } catch (err) {
      console.error("Failed to update course:", err);
      setError(err.response?.data?.message || "Failed to update course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="cc-page">
        <p>Loading course...</p>
      </div>
    );
  if (error)
    return (
      <div className="cc-page">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="cc-page">
      {/* Navbar */}
      <header className="cc-navbar">
        <div className="cc-navbar-left">
          <span className="cc-logo-mark">◆</span>
          <span className="cc-logo-text">SkillCraft</span>
        </div>

        <nav className="cc-nav-links">
          <Link to="/" className="cc-nav-link">
            Home
          </Link>
          <Link to="/courses" className="cc-nav-link">
            Courses
          </Link>
          <Link
            to="/tutor/dashboard"
            className="cc-nav-link cc-nav-link--active"
          >
            Tutors
          </Link>
          <Link to="/about" className="cc-nav-link">
            About Us
          </Link>
          <Link to="/contact" className="cc-nav-link">
            Contact
          </Link>
        </nav>

        <div className="cc-navbar-right">
          <Link to="/login" className="cc-btn cc-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="cc-btn cc-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="cc-main">
        {/* Heading */}
        <div className="cc-heading">
          <h1>Edit Course</h1>
          <div className="cc-breadcrumb">
            <Link to="/tutor/dashboard">Dashboard</Link>
            <ChevronRight size={14} />
            <Link to="/tutor/dashboard">Tutor</Link>
            <ChevronRight size={14} />
            <Link to="/tutor/courses">My Courses</Link>
            <ChevronRight size={14} />
            <span>Edit{courseId ? ` · ${courseId}` : ""}</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Body grid */}
        <div className="cc-body-grid">
          {/* Step sidebar */}
          <div className="cc-panel cc-steps-panel">
            <ol className="cc-steps-list">
              {steps.map((step) => (
                <li
                  key={step.number}
                  className={`cc-step ${
                    activeStep === step.number ? "cc-step--active" : ""
                  } ${activeStep > step.number ? "cc-step--done" : ""}`}
                  onClick={() => setActiveStep(step.number)}
                >
                  <span className="cc-step-number">{step.number}</span>
                  <div className="cc-step-text">
                    <p className="cc-step-title">{step.title}</p>
                    <p className="cc-step-description">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Form panel */}
          <div className="cc-panel cc-form-panel">
            {activeStep === 1 && (
              <>
                <h2 className="cc-form-heading">Basic Information</h2>

                <div className="cc-field">
                  <label htmlFor="courseTitle">Course Title</label>
                  <input
                    id="courseTitle"
                    type="text"
                    placeholder="Enter course title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="cc-field">
                  <label htmlFor="category">Category</label>
                  <div className="cc-select-wrap">
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Cream Making">Cream Making</option>
                      <option value="Soap Making">Soap Making</option>
                      <option value="Perfume Making">Perfume Making</option>
                      <option value="Baking">Baking</option>
                      <option value="Chemical Making">Chemical Making</option>
                    </select>
                    <ChevronDown size={16} className="cc-select-icon" />
                  </div>
                </div>

                <div className="cc-field">
                  <label htmlFor="shortDescription">Short Description</label>
                  <textarea
                    id="shortDescription"
                    rows={2}
                    maxLength={150}
                    placeholder="A short summary of your course"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                  <span className="cc-char-count">
                    {shortDescription.length}/150
                  </span>
                </div>

                <div className="cc-field">
                  <label htmlFor="fullDescription">Full Description</label>
                  <div className="cc-editor">
                    <div className="cc-editor-toolbar">
                      <button type="button" aria-label="Bold">
                        <Bold size={15} />
                      </button>
                      <button type="button" aria-label="Italic">
                        <Italic size={15} />
                      </button>
                      <button type="button" aria-label="Bulleted list">
                        <List size={15} />
                      </button>
                      <button type="button" aria-label="Numbered list">
                        <ListOrdered size={15} />
                      </button>
                      <button type="button" aria-label="Insert link">
                        <Link2 size={15} />
                      </button>
                    </div>
                    <textarea
                      id="fullDescription"
                      rows={5}
                      placeholder="Describe what students will learn in this course..."
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <h2 className="cc-form-heading">Curriculum</h2>
                <ul className="cc-lesson-edit-list">
                  {lessons.map((lesson) => (
                    <li className="cc-lesson-edit-row" key={lesson.id}>
                      <GripVertical size={16} className="cc-lesson-grip" />
                      <div className="cc-lesson-edit-info">
                        <p>{lesson.title}</p>
                        <span>{lesson.duration}</span>
                      </div>
                      <button
                        type="button"
                        className="cc-icon-action"
                        aria-label="Edit lesson"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="cc-icon-action cc-icon-action--danger"
                        aria-label="Remove lesson"
                        onClick={() => removeLesson(lesson.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="cc-btn cc-btn--outline cc-btn--block"
                  onClick={addLesson}
                >
                  <Plus size={16} />
                  Add Lesson
                </button>
              </>
            )}

            {activeStep === 3 && (
              <>
                <h2 className="cc-form-heading">Pricing</h2>
                <div className="cc-field">
                  <label htmlFor="price">Course Price (USD)</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="cc-field">
                  <label htmlFor="enrollmentType">Enrollment Type</label>
                  <div className="cc-select-wrap">
                    <select id="enrollmentType" defaultValue="paid">
                      <option value="paid">One-time Purchase</option>
                      <option value="free">Free</option>
                    </select>
                    <ChevronDown size={16} className="cc-select-icon" />
                  </div>
                </div>
              </>
            )}

            {activeStep === 4 && (
              <>
                <h2 className="cc-form-heading">Course Preview</h2>
                <div className="cc-preview-card">
                  <img
                    src={
                      thumbnail || "https://picsum.photos/seed/default/400/300"
                    }
                    alt={title}
                  />
                  <div>
                    <p className="cc-preview-title">{title}</p>
                    <p className="cc-preview-meta">
                      {category} · {level} · {language}
                    </p>
                    <p className="cc-preview-desc">{shortDescription}</p>
                    <p className="cc-preview-price">
                      ${Number(price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="cc-sidebar-col">
            <div className="cc-panel">
              <h2 className="cc-panel-title">Course Thumbnail</h2>
              <label className="cc-upload-box" htmlFor="thumbnailUpload">
                <img
                  src={
                    thumbnail || "https://picsum.photos/seed/default/400/300"
                  }
                  alt="Current course thumbnail"
                  className="cc-upload-preview"
                />
                <span className="cc-upload-label">Change Image</span>
                <span className="cc-upload-hint">PNG, JPG up to 5MB</span>
                <input
                  id="thumbnailUpload"
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                />
              </label>

              <div className="cc-field cc-field--tight">
                <label htmlFor="courseLevel">Course Level</label>
                <div className="cc-select-wrap">
                  <select
                    id="courseLevel"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <ChevronDown size={16} className="cc-select-icon" />
                </div>
              </div>

              <div className="cc-field cc-field--tight">
                <label htmlFor="language">Language</label>
                <div className="cc-select-wrap">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                  <ChevronDown size={16} className="cc-select-icon" />
                </div>
              </div>

              <button
                type="button"
                className="cc-btn cc-btn--primary cc-btn--block"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                className="cc-btn cc-btn--outline cc-btn--block"
                onClick={() => navigate("/tutor/courses")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
