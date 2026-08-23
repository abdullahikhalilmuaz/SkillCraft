import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, ChevronDown } from "lucide-react";
import "../styles/courses.css";

const CATEGORIES = ["Cream Making", "Soap Making", "Perfume Making"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const COURSES = [
  {
    id: "c1",
    title: "Beginner Cream Making Masterclass",
    category: "Cream Making",
    level: "Beginner",
    instructor: "Sarah Johnson",
    rating: 4.8,
    reviews: 100,
    price: 49.99,
    image: "https://picsum.photos/seed/cream-jar-1/400/300",
  },
  {
    id: "c2",
    title: "Natural Soap Making From Scratch",
    category: "Soap Making",
    level: "Beginner",
    instructor: "Michael Brown",
    rating: 4.7,
    reviews: 98,
    price: 39.99,
    image: "https://picsum.photos/seed/soap-bars-1/400/300",
  },
  {
    id: "c3",
    title: "Perfume Making For Beginners",
    category: "Perfume Making",
    level: "Beginner",
    instructor: "Emma Davis",
    rating: 4.9,
    reviews: 150,
    price: 59.99,
    image: "https://picsum.photos/seed/perfume-bottle-1/400/300",
  },
  {
    id: "c4",
    title: "Advanced Cream Formulation",
    category: "Cream Making",
    level: "Advanced",
    instructor: "Sarah Johnson",
    rating: 4.9,
    reviews: 74,
    price: 69.99,
    image: "https://picsum.photos/seed/cream-jar-2/400/300",
  },
  {
    id: "c5",
    title: "Herbal Soap Making Advanced",
    category: "Soap Making",
    level: "Advanced",
    instructor: "Michael Brown",
    rating: 4.6,
    reviews: 61,
    price: 44.99,
    image: "https://picsum.photos/seed/soap-bars-2/400/300",
  },
  {
    id: "c6",
    title: "Advanced Perfume Blending",
    category: "Perfume Making",
    level: "Advanced",
    instructor: "Emma Davis",
    rating: 4.9,
    reviews: 112,
    price: 79.99,
    image: "https://picsum.photos/seed/perfume-bottle-2/400/300",
  },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [maxPrice, setMaxPrice] = useState(200);

  const allCategories = selectedCategories.length === 0;
  const allLevels = selectedLevels.length === 0;

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleLevel = (lvl) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const [appliedMaxPrice, setAppliedMaxPrice] = useState(200);
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedLevels, setAppliedLevels] = useState([]);

  const applyFilters = () => {
    setAppliedMaxPrice(maxPrice);
    setAppliedCategories(selectedCategories);
    setAppliedLevels(selectedLevels);
  };

  const filteredCourses = useMemo(() => {
    let list = COURSES.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        appliedCategories.length === 0 || appliedCategories.includes(course.category);
      const matchesLevel =
        appliedLevels.length === 0 || appliedLevels.includes(course.level);
      const matchesPrice = course.price <= appliedMaxPrice;
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, sort, appliedCategories, appliedLevels, appliedMaxPrice]);

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
          <Link to="/courses" className="courses-nav__link courses-nav__link--active">
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
            <Link to="/">Home</Link> <span>›</span> <span>Courses</span>
          </p>
        </div>

        <div className="courses-layout">
          {/* Sidebar filters */}
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

            <button className="courses-btn courses-btn--primary courses-btn--full" onClick={applyFilters}>
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
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
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

            {filteredCourses.length === 0 ? (
              <p className="courses-empty">No courses match your filters yet. Try adjusting them.</p>
            ) : (
              <div className="courses-grid">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small presentational bits ---------- */

function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card">
      <div className="course-card__image-wrap">
        <img src={course.image} alt={course.title} className="course-card__image" loading="lazy" />
      </div>

      <div className="course-card__body">
        <span className="course-card__tag">{course.category}</span>
        <h3 className="course-card__title">{course.title}</h3>

        <div className="course-card__instructor">
          <span className="course-card__avatar">{course.instructor.charAt(0)}</span>
          <span>{course.instructor}</span>
        </div>

        <div className="course-card__footer">
          <span className="course-card__rating">
            <Star size={14} fill="#FACC15" stroke="#FACC15" />
            {course.rating.toFixed(1)}{" "}
            <span className="course-card__reviews">({course.reviews})</span>
          </span>
          <span className="course-card__price">${course.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 1 L24 7 L13 13 L2 7 Z" fill="#9333EA" />
      <path d="M13 13 L24 7 V17 L13 23 Z" fill="#C084FC" />
      <path d="M13 13 L2 7 V17 L13 23 Z" fill="#7C3AED" />
    </svg>
  );
}