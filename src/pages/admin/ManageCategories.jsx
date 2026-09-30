import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import api from "../../services/api";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", image: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, image: category.image || "" });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ name: "", image: "" });
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      if (editing) {
        await api.put(`/admin/categories/${editing._id}`, form);
      } else {
        await api.post("/admin/categories", form);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div>
      <div className="ad-header">
        <div>
          <h1>Manage Categories</h1>
          <p style={{ color: "var(--ink-600)", margin: 0, fontSize: 14 }}>
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} on
            the platform
          </p>
        </div>
        <button className="ad-btn ad-btn--primary" onClick={openCreate}>
          <Plus size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <div className="ad-empty">
          <Tag size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
          <h3>No categories yet</h3>
          <p>Create your first category to organize courses.</p>
          <button className="ad-btn ad-btn--primary" onClick={openCreate}>
            <Plus size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Add Category
          </button>
        </div>
      ) : (
        <div className="ad-card-grid">
          {categories.map((cat) => (
            <div className="ad-category-card" key={cat._id}>
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="ad-category-image"
                />
              ) : (
                <div className="ad-category-image">
                  <Tag size={36} />
                </div>
              )}
              <div className="ad-category-body">
                <p className="ad-category-name">{cat.name}</p>
                <p className="ad-category-meta">
                  Created {new Date(cat.createdAt).toLocaleDateString()}
                </p>
                <div className="ad-category-actions">
                  <button
                    className="ad-btn ad-btn--ghost"
                    onClick={() => openEdit(cat)}
                  >
                    <Edit2 size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    Edit
                  </button>
                  <button
                    className="ad-btn ad-btn--danger"
                    onClick={() => handleDelete(cat._id)}
                  >
                    <Trash2 size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="ad-modal-overlay" onClick={closeModal}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2>{editing ? "Edit Category" : "Add Category"}</h2>
              <button className="ad-modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="ad-modal-body">
                <div className="ad-form-group">
                  <label>Category Name</label>
                  <input
                    className="ad-input"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Cream Making"
                    autoFocus
                  />
                </div>
                <div className="ad-form-group">
                  <label>Image URL (optional)</label>
                  <input
                    className="ad-input"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                {error && (
                  <p style={{ color: "var(--red-600)", fontSize: 13, margin: 0 }}>
                    {error}
                  </p>
                )}
              </div>
              <div className="ad-modal-actions">
                <button
                  type="button"
                  className="ad-btn ad-btn--ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ad-btn ad-btn--primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}