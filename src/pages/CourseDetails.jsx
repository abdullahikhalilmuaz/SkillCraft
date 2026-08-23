import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  PlayCircle,
  Star,
  Users,
  BookOpen,
  HelpCircle,
  FileText,
  Award,
  Infinity as InfinityIcon,
  Smartphone,
  Heart,
  //   Facebook,
  //   Twitter,
  //   Linkedin,
  Link2,
  CheckCircle2,
} from "lucide-react";
import "../styles/coursedetails.css";

const COURSE = {
  category: "Cream Making",
  title: "Beginner Cream Making Masterclass",
  instructor: {
    name: "Sarah Johnson",
    title: "Expert Cream Formulator",
    initials: "SJ",
  },
  rating: 4.9,
  reviews: 120,
  students: 1245,
  price: 49.99,
  description:
    "Learn the fundamentals of cream making. This course is perfect for beginners who want to start their journey in skincare product formulation.",
  lessons: 12,
  quizzes: 4,
  gallery: [
    "https://picsum.photos/seed/cream-hero/700/500",
    "https://picsum.photos/seed/cream-thumb-1/200/150",
    "https://picsum.photos/seed/cream-thumb-2/200/150",
    "https://picsum.photos/seed/cream-thumb-3/200/150",
    "https://picsum.photos/seed/cream-thumb-4/200/150",
  ],
  includes: [
    { icon: BookOpen, label: "12 Video Lessons" },
    { icon: HelpCircle, label: "4 Quizzes" },
    { icon: FileText, label: "Course Materials" },
    { icon: Award, label: "Certificate of Completion" },
    { icon: InfinityIcon, label: "Lifetime Access" },
    { icon: Smartphone, label: "Access on Mobile & TV" },
  ],
  aboutBullets: [
    "Understand the basic ingredients used in cream formulation",
    "Learn how to balance oils, emulsifiers, and actives",
    "Formulate a stable, skin-friendly cream from scratch",
    "Package and label your finished product like a pro",
  ],
  curriculum: [
    { section: "Getting Started", lessons: 3, duration: "24 min" },
    { section: "Choosing Your Ingredients", lessons: 4, duration: "41 min" },
    { section: "Formulating Your First Cream", lessons: 3, duration: "38 min" },
    {
      section: "Packaging & Finishing Touches",
      lessons: 2,
      duration: "19 min",
    },
  ],
};

const TABS = ["Overview", "Curriculum", "Instructor", "Reviews"];

export default function CourseDetails() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeImage, setActiveImage] = useState(COURSE.gallery[0]);

  return (
    <div className="cd-page">
      {/* Navbar */}
      <header className="cd-nav">
        <Link to="/" className="cd-nav__brand">
          <LogoMark />
          <span>SkillCraft</span>
        </Link>

        <nav className="cd-nav__links">
          <Link to="/" className="cd-nav__link">
            Home
          </Link>
          <Link to="/courses" className="cd-nav__link cd-nav__link--active">
            Courses
          </Link>
          <Link to="/tutors" className="cd-nav__link">
            Tutors
          </Link>
          <Link to="/about" className="cd-nav__link">
            About Us
          </Link>
          <Link to="/contact" className="cd-nav__link">
            Contact
          </Link>
        </nav>

        <div className="cd-nav__actions">
          <button className="cd-icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/login" className="cd-btn cd-btn--ghost">
            Login
          </Link>
          <Link to="/register" className="cd-btn cd-btn--primary">
            Sign Up
          </Link>
        </div>
      </header>

      <div className="cd-body">
        {/* Breadcrumb */}
        <p className="cd-breadcrumb">
          <Link to="/">Home</Link> <span>›</span>{" "}
          <Link to="/courses">Courses</Link> <span>›</span>{" "}
          <span>{COURSE.title}</span>
        </p>

        <div className="cd-layout">
          {/* Left: gallery + tabs */}
          <div className="cd-main">
            <div className="cd-gallery">
              <div className="cd-gallery__hero">
                <img src={activeImage} alt={COURSE.title} />
                {activeImage === COURSE.gallery[0] && (
                  <button
                    className="cd-gallery__play"
                    aria-label="Play preview video"
                  >
                    <PlayCircle size={54} />
                  </button>
                )}
              </div>

              <div className="cd-gallery__thumbs">
                {COURSE.gallery.slice(1).map((src, i) => (
                  <button
                    key={i}
                    className={`cd-gallery__thumb ${activeImage === src ? "cd-gallery__thumb--active" : ""}`}
                    onClick={() => setActiveImage(src)}
                  >
                    <img src={src} alt={`${COURSE.title} preview ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="cd-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`cd-tabs__item ${activeTab === tab ? "cd-tabs__item--active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Reviews" && ` (${COURSE.reviews})`}
                </button>
              ))}
            </div>

            <div className="cd-tab-panel">
              {activeTab === "Overview" && (
                <div>
                  <h2>About This Course</h2>
                  <p className="cd-tab-panel__lead">
                    This comprehensive course will teach you everything you need
                    to know about creating high-quality creams for various skin
                    types.
                  </p>
                  <ul className="cd-checklist">
                    {COURSE.aboutBullets.map((bullet) => (
                      <li key={bullet}>
                        <CheckCircle2 size={16} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "Curriculum" && (
                <div>
                  <h2>Course Curriculum</h2>
                  <ul className="cd-curriculum">
                    {COURSE.curriculum.map((section) => (
                      <li key={section.section}>
                        <span className="cd-curriculum__name">
                          {section.section}
                        </span>
                        <span className="cd-curriculum__meta">
                          {section.lessons} lessons · {section.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "Instructor" && (
                <div className="cd-instructor-panel">
                  <span className="cd-avatar cd-avatar--lg">
                    {COURSE.instructor.initials}
                  </span>
                  <div>
                    <h2>{COURSE.instructor.name}</h2>
                    <p className="cd-tab-panel__lead">
                      {COURSE.instructor.title}
                    </p>
                    <p>
                      Sarah has over 10 years of experience formulating skincare
                      products and has taught thousands of students the
                      fundamentals of cream making.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "Reviews" && (
                <div>
                  <h2>Student Reviews</h2>
                  <p className="cd-tab-panel__lead">
                    {COURSE.rating.toFixed(1)} average rating from{" "}
                    {COURSE.reviews} reviews.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: purchase card + includes + share */}
          <aside className="cd-sidebar">
            <div className="cd-purchase-card">
              <span className="cd-tag">{COURSE.category}</span>
              <h1 className="cd-title">{COURSE.title}</h1>

              <div className="cd-instructor-row">
                <span className="cd-avatar">{COURSE.instructor.initials}</span>
                <div>
                  <p className="cd-instructor-row__name">
                    {COURSE.instructor.name}
                  </p>
                  <p className="cd-instructor-row__title">
                    {COURSE.instructor.title}
                  </p>
                </div>
              </div>

              <div className="cd-meta-row">
                <span className="cd-meta-row__rating">
                  <Star size={14} fill="#FACC15" stroke="#FACC15" />
                  {COURSE.rating.toFixed(1)}{" "}
                  <span className="cd-meta-row__muted">
                    ({COURSE.reviews} Reviews)
                  </span>
                </span>
                <span className="cd-meta-row__students">
                  <Users size={14} />
                  {COURSE.students.toLocaleString()} Students
                </span>
              </div>

              <p className="cd-price">${COURSE.price.toFixed(2)}</p>
              <p className="cd-description">{COURSE.description}</p>

              <div className="cd-quick-facts">
                <span>
                  <BookOpen size={14} /> {COURSE.lessons} Lessons
                </span>
                <span>
                  <HelpCircle size={14} /> {COURSE.quizzes} Quizzes
                </span>
                <span>
                  <Award size={14} /> Certificate
                </span>
                <span>
                  <InfinityIcon size={14} /> Lifetime Access
                </span>
              </div>

              <div className="cd-cta-row">
                <button className="cd-btn cd-btn--primary cd-btn--full">
                  Enroll Now
                </button>
                <button className="cd-btn cd-btn--outline cd-btn--full">
                  <Heart size={16} /> Add to Wishlist
                </button>
              </div>
            </div>

            <div className="cd-side-card">
              <h3>Course Includes</h3>
              <ul className="cd-includes-list">
                {COURSE.includes.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cd-side-card">
              <h3>Share this course</h3>
              <div className="cd-share-row">
                <button className="cd-share-btn" aria-label="Share on Facebook">
                  {/* <Facebook size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Share on Twitter">
                  {/* <Twitter size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Share on LinkedIn">
                  {/* <Linkedin size={16} /> */}
                </button>
                <button className="cd-share-btn" aria-label="Copy link">
                  <Link2 size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

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
