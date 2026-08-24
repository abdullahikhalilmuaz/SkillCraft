import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, ChevronDown } from "lucide-react";
import api from "../services/api";
import "../pages/courses.css";

const CATEGORIES = [
  "Cream Making",
  "Soap Making",
  "Perfume Making",
  "Baking",
  "Chemical Making",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);

  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedLevels, setAppliedLevels] = useState([]);

  const [maxPrice, setMaxPrice] = useState(200);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(200);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/courses");

        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load courses. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((item) => item !== level)
        : [...prev, level],
    );
  };

  const applyFilters = () => {
    setAppliedCategories(selectedCategories);
    setAppliedLevels(selectedLevels);
    setAppliedMaxPrice(maxPrice);
  };

  const filteredCourses = useMemo(() => {
    let list = courses.filter((course) => {
      const title = course.title?.toLowerCase() || "";
      const category = course.category || "";
      const level = course.level || "";

      const matchesSearch = title.includes(search.toLowerCase());

      const matchesCategory =
        appliedCategories.length === 0 || appliedCategories.includes(category);

      const matchesLevel =
        appliedLevels.length === 0 || appliedLevels.includes(level);

      const matchesPrice = Number(course.price || 0) <= appliedMaxPrice;

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "rating") {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      list = [...list].sort((a, b) => (b.students || 0) - (a.students || 0));
    }

    return list;
  }, [
    courses,
    search,
    sort,
    appliedCategories,
    appliedLevels,
    appliedMaxPrice,
  ]);

  const allCategories = selectedCategories.length === 0;
  const allLevels = selectedLevels.length === 0;

  return (
    <div className="courses-page">
      {/* Navbar */}
      <header className="courses-nav">
        <Link to="/" className="courses-nav__brand">
          <LogoMark />
          <span>SkillCraft</span>
        </Link>

        <nav className="courses-nav__links">
          <Link to="/" className="courses-nav__link">
            Home
          </Link>

          <Link
            to="/courses"
            className="courses-nav__link courses-nav__link--active"
          >
            Courses
          </Link>

          <Link to="/tutors" className="courses-nav__link">
            Tutors
          </Link>

          <Link to="/about" className="courses-nav__link">
            About Us
          </Link>

          <Link to="/contact" className="courses-nav__link">
            Contact
          </Link>
        </nav>

        <div className="courses-nav__actions">
          <button className="courses-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>

          <Link to="/login" className="courses-btn courses-btn--ghost">
            Login
          </Link>

          <Link to="/register" className="courses-btn courses-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <div className="courses-body">
        {/* Header */}
        <div className="courses-header">
          <h1>All Courses</h1>

          <p className="courses-breadcrumb">
            <Link to="/student/dashboard">Dashboard</Link>
            <span>›</span>
            <span>Courses</span>
          </p>
        </div>

        <div className="courses-layout">
          {/* Sidebar */}
          <aside className="courses-filters">
            <h2 className="courses-filters__title">Filters</h2>

            <div className="courses-filter-group">
              <h3>Category</h3>

              <label className="courses-checkbox">
                <input
                  type="checkbox"
                  checked={allCategories}
                  onChange={() => setSelectedCategories([])}
                />
                All Categories
              </label>

              {CATEGORIES.map((cat) => (
                <label className="courses-checkbox" key={cat}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            <div className="courses-filter-group">
              <h3>Level</h3>

              <label className="courses-checkbox">
                <input
                  type="checkbox"
                  checked={allLevels}
                  onChange={() => setSelectedLevels([])}
                />
                All Levels
              </label>

              {LEVELS.map((lvl) => (
                <label className="courses-checkbox" key={lvl}>
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(lvl)}
                    onChange={() => toggleLevel(lvl)}
                  />
                  {lvl}
                </label>
              ))}
            </div>

            <div className="courses-filter-group">
              <h3>Price</h3>

              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="courses-range"
                aria-label="Maximum price"
              />

              <div className="courses-range__labels">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>

            <button
              className="courses-btn courses-btn--primary courses-btn--full"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </aside>

          {/* Main content */}
          <div className="courses-main">
            <div className="courses-toolbar">
              <div className="courses-search">
                <Search size={16} />

                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="courses-sort">
                <span>Sort by:</span>

                <div className="courses-sort__select">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && <p className="courses-empty">Loading courses...</p>}

            {/* Error */}
            {!loading && error && <p className="courses-empty">{error}</p>}

            {/* Empty */}
            {!loading && !error && filteredCourses.length === 0 && (
              <p className="courses-empty">
                No courses match your filters yet. Try adjusting them.
              </p>
            )}

            {/* Courses */}
            {!loading && !error && filteredCourses.length > 0 && (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id || course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Course Card ---------- */

function CourseCard({ course }) {
  const instructorName =
    course.instructor?.name ||
    course.instructor?.username ||
    "SkillCraft Tutor";

  return (
    <Link to={`/courses/${course._id || course.id}`} className="course-card">
      <div className="course-card__image-wrap">
        <img
          src={
            course.image ||
            "https://picsum.photos/seed/skillcraft-course/400/300"
          }
          alt={course.title}
          className="course-card__image"
          loading="lazy"
        />
      </div>

      <div className="course-card__body">
        <span className="course-card__tag">{course.category}</span>

        <h3 className="course-card__title">{course.title}</h3>

        <div className="course-card__instructor">
          <span className="course-card__avatar">
            {instructorName.charAt(0).toUpperCase()}
          </span>

          <span>{instructorName}</span>
        </div>

        <div className="course-card__footer">
          <span className="course-card__rating">
            <Star size={14} fill="#FACC15" stroke="#FACC15" />

            {(course.rating || 0).toFixed(1)}

            <span className="course-card__reviews">
              ({course.reviews || 0})
            </span>
          </span>

          <span className="course-card__price">
            ${(course.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Logo ---------- */

function LogoMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 1 L24 7 L13 13 L2 7 Z" fill="#9333EA" />

      <path d="M13 13 L24 7 V17 L13 23 Z" fill="#C084FC" />

      <path d="M13 13 L2 7 V17 L13 23 Z" fill="#7C3AED" />
    </svg>
  );
}
