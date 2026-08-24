import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/createcourse.css";
import api from "../../services/api";

import {
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
} from "lucide-react";

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

export default function CreateCourse() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(1);

  const [form, setForm] = React.useState({
    title: "",
    category: "",
    level: "",
    shortDescription: "",
    fullDescription: "",
    language: "English",
  });

  const [thumbnail, setThumbnail] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [courseId, setCourseId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Please select a PNG or JPG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setThumbnail(file);
    setError("");
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Course title is required.";
    }

    if (!form.category) {
      return "Please select a course category.";
    }

    if (!form.level) {
      return "Please select a course level.";
    }

    if (!form.shortDescription.trim()) {
      return "Short description is required.";
    }

    if (!form.fullDescription.trim()) {
      return "Full description is required.";
    }

    return "";
  };

  const createCourse = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return null;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      /*
       * The current backend accepts only:
       * title, category, level, description and image.
       *
       * Short + full description are combined into the
       * single description field required by Course.js.
       */

      const description = `${form.shortDescription.trim()}\n\n${form.fullDescription.trim()}`;

      const payload = {
        title: form.title.trim(),
        category: form.category,
        level: form.level,
        description,
        image: "",
      };

      const response = await api.post("/courses", payload);

      setSuccess("Course created successfully.");

      return response.data.course;
    } catch (err) {
      console.error("Create course error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create course. Please try again.",
      );

      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAndContinue = async () => {
    /*
     * Step 1 creates the actual course.
     * The backend automatically makes it a draft.
     */
    if (activeStep === 1) {
      const course = await createCourse();

      if (!course) return;

      setCourseId(course._id);
      setActiveStep(2);

      return;
    }

    setActiveStep((step) => Math.min(step + 1, steps.length));
  };

  const handleSaveDraft = async () => {
    /*
     * Creating a course already creates it as:
     *
     * published: false
     *
     * So this is currently the same backend operation
     * as creating a draft.
     */
    if (activeStep === 1) {
      const course = await createCourse();

      if (!course) return;

      setSuccess("Course saved as draft.");

      /*
       * Give the success message a moment before returning
       * to the tutor dashboard.
       */
      setTimeout(() => {
        navigate("/tutor/dashboard");
      }, 800);

      return;
    }

    setSuccess("Your course is currently saved as a draft.");
  };

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
          <h1>Create New Course</h1>

          <div className="cc-breadcrumb">
            <Link to="/tutor/dashboard">Dashboard</Link>
            <ChevronRight size={14} />

            <Link to="/tutor/dashboard">Tutor</Link>
            <ChevronRight size={14} />

            <span>Create Course</span>
          </div>
        </div>

        {/* Error / Success messages */}
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

        {success && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#f0fdf4",
              color: "#15803d",
              fontSize: "14px",
            }}
          >
            {success}
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
          {/* Form panel */}
          <div className="cc-panel cc-form-panel">
            {activeStep === 1 && (
              <>
                <h2 className="cc-form-heading">Basic Information</h2>

                <div className="cc-field">
                  <label htmlFor="title">Course Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter course title"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="cc-field">
                  <label htmlFor="category">Category</label>

                  <div className="cc-select-wrap">
                    <select
                      id="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
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
                    value={form.shortDescription}
                    onChange={handleChange}
                  />

                  <span className="cc-char-count">
                    {form.shortDescription.length}/150
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
                      value={form.fullDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                <h2 className="cc-form-heading">Curriculum</h2>

                <div className="cc-field">
                  <label>Course Curriculum</label>

                  <div
                    style={{
                      padding: "30px",
                      border: "1px dashed #d8b4fe",
                      borderRadius: "12px",
                      textAlign: "center",
                      background: "#faf5ff",
                    }}
                  >
                    <h3 style={{ marginBottom: "8px" }}>
                      Add Sections and Lessons
                    </h3>

                    <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                      Start building the lessons students will follow in this
                      course.
                    </p>

                    <button
                      type="button"
                      className="cc-btn cc-btn--primary"
                      onClick={() => {
                        alert("Curriculum builder coming next.");
                      }}
                    >
                      + Add Section
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                  }}
                >
                  <button
                    type="button"
                    className="cc-btn cc-btn--outline"
                    onClick={() => setActiveStep(1)}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="cc-btn cc-btn--primary"
                    onClick={() => setActiveStep(3)}
                  >
                    Continue to Pricing
                  </button>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                <h2 className="cc-form-heading">Pricing</h2>

                <div
                  style={{
                    padding: "30px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    background: "#fafafa",
                  }}
                >
                  <h3>Course Pricing</h3>

                  <p style={{ color: "#6b7280", marginTop: "8px" }}>
                    Courses are currently free as payment is disabled for this
                    FYP.
                  </p>

                  <div style={{ marginTop: "20px" }}>
                    <strong>Price: $0.00</strong>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                  }}
                >
                  <button
                    type="button"
                    className="cc-btn cc-btn--outline"
                    onClick={() => setActiveStep(2)}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="cc-btn cc-btn--primary"
                    onClick={() => setActiveStep(4)}
                  >
                    Continue to Preview
                  </button>
                </div>
              </>
            )}

            {activeStep === 4 && (
              <>
                <h2 className="cc-form-heading">Course Preview</h2>

                <div
                  style={{
                    padding: "25px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                >
                  <h3>{form.title || "Untitled Course"}</h3>

                  <p style={{ marginTop: "10px" }}>{form.shortDescription}</p>

                  <div style={{ marginTop: "20px" }}>
                    <strong>Category:</strong> {form.category}
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <strong>Level:</strong> {form.level}
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <strong>Language:</strong> {form.language}
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <strong>Description</strong>

                    <p style={{ marginTop: "8px", whiteSpace: "pre-line" }}>
                      {form.fullDescription}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "30px",
                  }}
                >
                  <button
                    type="button"
                    className="cc-btn cc-btn--outline"
                    onClick={() => setActiveStep(3)}
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    className="cc-btn cc-btn--primary"
                    onClick={() => navigate("/tutor/dashboard")}
                  >
                    Finish
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right sidebar */}
          <div className="cc-sidebar-col">
            <div className="cc-panel">
              <h2 className="cc-panel-title">Course Thumbnail</h2>

              <label className="cc-upload-box" htmlFor="thumbnailUpload">
                <ImagePlus size={26} className="cc-upload-icon" />

                <span className="cc-upload-label">
                  {thumbnail ? thumbnail.name : "Upload Image"}
                </span>

                <span className="cc-upload-hint">PNG, JPG up to 5MB</span>

                <input
                  id="thumbnailUpload"
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={handleThumbnailChange}
                />
              </label>

              <div className="cc-field cc-field--tight">
                <label htmlFor="level">Course Level</label>

                <div className="cc-select-wrap">
                  <select id="level" value={form.level} onChange={handleChange}>
                    <option value="" disabled>
                      Select level
                    </option>

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
                    value={form.language}
                    onChange={handleChange}
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                  </select>

                  <ChevronDown size={16} className="cc-select-icon" />
                </div>
              </div>

              {activeStep === 1 && (
                <button
                  type="button"
                  className="cc-btn cc-btn--primary cc-btn--block"
                  onClick={handleSaveAndContinue}
                  disabled={submitting}
                >
                  {submitting ? "Creating Course..." : "Save & Continue"}
                </button>
              )}

              <button
                type="button"
                className="cc-btn cc-btn--outline cc-btn--block"
                onClick={handleSaveDraft}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save as Draft"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
