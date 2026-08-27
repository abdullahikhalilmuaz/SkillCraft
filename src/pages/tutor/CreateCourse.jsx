import React, { useEffect } from "react";
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
  Upload,
  Play,
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
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [courseId, setCourseId] = React.useState(null);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Curriculum states
  const [lessons, setLessons] = React.useState([]);
  const [showLessonModal, setShowLessonModal] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState(null);
  const [lessonForm, setLessonForm] = React.useState({
    title: "",
    description: "",
    content: "",
    videoUrl: "",
    duration: 0,
    order: 1,
  });
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [uploadingVideo, setUploadingVideo] = React.useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleLessonChange = (e) => {
    const { id, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = null;

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Please select a PNG or JPG image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setThumbnailUrl(res.data.url);
      setThumbnail(file);
      setSuccess("Thumbnail uploaded successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      setError(err.response?.data?.message || "Failed to upload thumbnail.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (type === "image") setUploadingImage(true);
    else setUploadingVideo(true);

    setError("");

    try {
      const res = await api.post(`/upload/${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (type === "image") {
        setLessonForm((prev) => ({
          ...prev,
          content:
            prev.content + `\n<img src="${res.data.url}" alt="image" />\n`,
        }));
      } else if (type === "video") {
        setLessonForm((prev) => ({
          ...prev,
          videoUrl: res.data.url,
        }));
      }

      setSuccess(`${type} uploaded successfully.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || `Failed to upload ${type}.`);
    } finally {
      if (type === "image") setUploadingImage(false);
      else setUploadingVideo(false);
    }
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
      const description = `${form.shortDescription.trim()}\n\n${form.fullDescription.trim()}`;

      const payload = {
        title: form.title.trim(),
        category: form.category,
        level: form.level,
        description,
        image: thumbnailUrl,
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

  const fetchLessons = async () => {
    if (!courseId) return;
    try {
      const res = await api.get(`/lessons/course/${courseId}`);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const handleSaveLesson = async () => {
    if (!lessonForm.title.trim()) {
      setError("Lesson title is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title: lessonForm.title,
        description: lessonForm.description,
        content: lessonForm.content,
        videoUrl: lessonForm.videoUrl,
        duration: Number(lessonForm.duration),
        order: Number(lessonForm.order),
      };

      if (editingLesson) {
        await api.put(`/lessons/${editingLesson._id}`, payload);
      } else {
        await api.post(`/lessons/course/${courseId}`, payload);
      }

      setShowLessonModal(false);
      setEditingLesson(null);
      setLessonForm({
        title: "",
        description: "",
        content: "",
        videoUrl: "",
        duration: 0,
        order: lessons.length + 1,
      });
      fetchLessons();
      setSuccess(editingLesson ? "Lesson updated." : "Lesson added.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Save lesson error:", err);
      setError(err.response?.data?.message || "Failed to save lesson.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      fetchLessons();
      setSuccess("Lesson deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete lesson error:", err);
      setError(err.response?.data?.message || "Failed to delete lesson.");
    }
  };

  const editLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title || "",
      description: lesson.description || "",
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || 0,
      order: lesson.order || 1,
    });
    setShowLessonModal(true);
  };

  const handleSaveAndContinue = async () => {
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
    if (activeStep === 1) {
      const course = await createCourse();

      if (!course) return;

      setSuccess("Course saved as draft.");

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
                  <label>Course Lessons</label>

                  {lessons.length === 0 ? (
                    <div
                      style={{
                        padding: "30px",
                        border: "1px dashed #d8b4fe",
                        borderRadius: "12px",
                        textAlign: "center",
                        background: "#faf5ff",
                      }}
                    >
                      <p style={{ color: "#6b7280" }}>
                        No lessons yet. Add your first lesson!
                      </p>
                    </div>
                  ) : (
                    <ul className="cc-lesson-list">
                      {lessons.map((lesson, index) => (
                        <li key={lesson._id} className="cc-lesson-item">
                          <span className="cc-lesson-order">{index + 1}</span>
                          <div className="cc-lesson-info">
                            <p className="cc-lesson-title">{lesson.title}</p>
                            <p className="cc-lesson-meta">
                              {lesson.duration || 0} min •
                              {lesson.videoUrl ? " Video" : " Text"}
                            </p>
                          </div>
                          <div className="cc-lesson-actions">
                            <button
                              type="button"
                              onClick={() => editLesson(lesson)}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteLesson(lesson._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    className="cc-btn cc-btn--outline"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      setEditingLesson(null);
                      setLessonForm({
                        title: "",
                        description: "",
                        content: "",
                        videoUrl: "",
                        duration: 0,
                        order: lessons.length + 1,
                      });
                      setShowLessonModal(true);
                    }}
                  >
                    + Add Lesson
                  </button>
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

                  {thumbnailUrl && (
                    <div style={{ marginTop: "16px" }}>
                      <strong>Thumbnail:</strong>
                      <img
                        src={thumbnailUrl}
                        alt="Course thumbnail"
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "8px",
                        }}
                      />
                    </div>
                  )}

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

                  {lessons.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <strong>Lessons ({lessons.length})</strong>
                      <ul>
                        {lessons.map((lesson, index) => (
                          <li key={lesson._id}>
                            {index + 1}. {lesson.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  disabled={uploadingImage}
                />
              </label>

              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Course thumbnail"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                />
              )}

              {uploadingImage && (
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  Uploading...
                </p>
              )}

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

      {/* Lesson Modal */}
      {showLessonModal && (
        <div
          className="cc-modal-overlay"
          onClick={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
          }}
        >
          <div
            className="cc-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>{editingLesson ? "Edit Lesson" : "Add Lesson"}</h2>
              <button
                type="button"
                onClick={() => {
                  setShowLessonModal(false);
                  setEditingLesson(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div className="cc-field">
              <label htmlFor="title">Lesson Title *</label>
              <input
                id="title"
                type="text"
                placeholder="Enter lesson title"
                value={lessonForm.title}
                onChange={handleLessonChange}
              />
            </div>

            <div className="cc-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={2}
                placeholder="Brief description"
                value={lessonForm.description}
                onChange={handleLessonChange}
              />
            </div>

            <div className="cc-field">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                rows={4}
                placeholder="Lesson content (text, images, etc.)"
                value={lessonForm.content}
                onChange={handleLessonChange}
              />
              <button
                type="button"
                className="cc-btn cc-btn--outline"
                style={{ marginTop: "8px" }}
                onClick={() => document.getElementById("imageUpload").click()}
                disabled={uploadingImage}
              >
                <ImagePlus size={16} />{" "}
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </button>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "image");
                  e.target.value = null;
                }}
              />
            </div>

            <div className="cc-field">
              <label htmlFor="videoUrl">Video URL</label>
              <input
                id="videoUrl"
                type="text"
                placeholder="https://youtube.com/... or upload video"
                value={lessonForm.videoUrl}
                onChange={handleLessonChange}
              />
              <button
                type="button"
                className="cc-btn cc-btn--outline"
                style={{ marginTop: "8px" }}
                onClick={() => document.getElementById("videoUpload").click()}
                disabled={uploadingVideo}
              >
                <Play size={16} />{" "}
                {uploadingVideo ? "Uploading..." : "Upload Video"}
              </button>
              <input
                id="videoUpload"
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, "video");
                  e.target.value = null;
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <div className="cc-field" style={{ flex: 1 }}>
                <label htmlFor="duration">Duration (minutes)</label>
                <input
                  id="duration"
                  type="number"
                  min="0"
                  value={lessonForm.duration}
                  onChange={handleLessonChange}
                />
              </div>
              <div className="cc-field" style={{ flex: 1 }}>
                <label htmlFor="order">Order</label>
                <input
                  id="order"
                  type="number"
                  min="1"
                  value={lessonForm.order}
                  onChange={handleLessonChange}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                className="cc-btn cc-btn--outline"
                onClick={() => {
                  setShowLessonModal(false);
                  setEditingLesson(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cc-btn cc-btn--primary"
                onClick={handleSaveLesson}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingLesson
                    ? "Update Lesson"
                    : "Add Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
