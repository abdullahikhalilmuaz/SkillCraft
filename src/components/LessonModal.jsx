import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import api from "../services/api";

export default function LessonModal({ courseId, lesson, onClose, onSave }) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl || "");
  const [duration, setDuration] = useState(lesson?.duration || 0);
  const [order, setOrder] = useState(lesson?.order || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post(`/upload/${type}`, formData);
      if (type === "video") {
        setVideoUrl(res.data.url);
      } else {
        // For images, append to content
        setContent(content + `\n<img src="${res.data.url}" alt="image" />\n`);
      }
    } catch (err) {
      setError("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Lesson title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        description,
        content,
        videoUrl,
        duration: Number(duration),
        order: Number(order),
      };

      if (lesson?._id) {
        await api.put(`/lessons/${lesson._id}`, payload);
      } else {
        await api.post(`/lessons/course/${courseId}`, payload);
      }

      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cc-modal-overlay" onClick={onClose}>
      <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cc-modal-header">
          <h2>{lesson ? "Edit Lesson" : "Add Lesson"}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="cc-modal-body">
          {error && <div className="cc-error">{error}</div>}

          <div className="cc-field">
            <label>Lesson Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
            />
          </div>

          <div className="cc-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
            />
          </div>

          <div className="cc-field">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Lesson content (text, images, etc.)"
              rows={5}
            />
            <div className="cc-upload-row">
              <label className="cc-upload-btn">
                <Upload size={16} /> Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "image")}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="cc-field">
            <label>Video URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
            />
            <label className="cc-upload-btn">
              <Upload size={16} /> Upload Video
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, "video")}
                hidden
              />
            </label>
            {uploading && <span>Uploading...</span>}
          </div>

          <div className="cc-field-row">
            <div className="cc-field">
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0"
              />
            </div>
            <div className="cc-field">
              <label>Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="cc-modal-footer">
          <button className="cc-btn cc-btn--outline" onClick={onClose}>
            Cancel
          </button>
          <button className="cc-btn cc-btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : lesson ? "Update Lesson" : "Add Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}