import React from "react";
import { Link } from "react-router-dom";
import "../../styles/airecommendations.css";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Award,
  Heart,
  HelpCircle,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Sparkles,
  Star,
  RefreshCw,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen, label: "My Learning" },
  { icon: GraduationCap, label: "Courses" },
  { icon: ClipboardCheck, label: "Quizzes" },
  { icon: Award, label: "Certificates" },
  { icon: Heart, label: "Wishlist" },
];

const recommendations = [
  {
    id: "advanced-cream-formulation",
    title: "Advanced Cream Formulation",
    tutor: "Sarah Johnson",
    rating: "4.9",
    reviews: "120",
    price: "$59.99",
    match: 96,
    reason: "Because you completed Beginner Cream Making Masterclass",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
    category: "Cream Making",
  },
  {
    id: "herbal-soap-making-advanced",
    title: "Herbal Soap Making Advanced",
    tutor: "Michael Brown",
    rating: "4.7",
    reviews: "98",
    price: "$39.99",
    match: 88,
    reason: "Popular with students who enrolled in Natural Soap Making",
    image:
      "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&h=200&fit=crop",
    category: "Soap Making",
  },
  {
    id: "advanced-perfume-blending",
    title: "Advanced Perfume Blending",
    tutor: "Emma Davis",
    rating: "4.9",
    reviews: "150",
    price: "$69.99",
    match: 82,
    reason: "Matches your interest in Perfume Making Basics",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
    category: "Perfume Making",
  },
  {
    id: "luxury-body-butter-masterclass",
    title: "Luxury Body Butter Masterclass",
    tutor: "Sarah Johnson",
    rating: "4.8",
    reviews: "110",
    price: "$49.99",
    match: 79,
    reason: "Based on your 18 hours of learning activity",
    image:
      "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=200&h=200&fit=crop",
    category: "Cream Making",
  },
];

const interestTags = [
  "Cream Making",
  "Soap Making",
  "Perfume Making",
  "Skincare Formulation",
  "Sensitive Skin",
];

export default function AIRecommendations() {
  return (
    <div className="ar-page">
      {/* Sidebar */}
      <aside className="ar-sidebar">
        <div className="ar-sidebar-logo">
          <span className="ar-logo-mark">◆</span>
          <span className="ar-logo-text">SkillCraft</span>
        </div>

        <nav className="ar-sidebar-nav">
          {navItems.map(({ icon: Icon, label }) => (
            <a href="#" key={label} className="ar-nav-item">
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="ar-sidebar-bottom">
          <a href="#" className="ar-nav-item">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </a>
          <a href="#" className="ar-nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      {/* Content */}
      <div className="ar-content">
        {/* Topbar */}
        <header className="ar-topbar">
          <div className="ar-topbar-spacer" />
          <div className="ar-topbar-right">
            <button className="ar-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <button className="ar-icon-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="ar-notif-dot" />
            </button>
            <div className="ar-user-chip">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop"
                alt="Abdullahi avatar"
                className="ar-user-avatar"
              />
              <span className="ar-user-name">Abdullahi</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="ar-main">
          {/* Heading */}
          <div className="ar-heading">
            <span className="ar-eyebrow">
              <Sparkles size={13} />
              AI-Powered
            </span>
            <h1>Recommended For You</h1>
            <p>
              Personalized course picks based on what you&rsquo;ve completed,
              your quiz results, and your learning activity.
            </p>
          </div>

          {/* Interest tags */}
          <div className="ar-interests">
            <span className="ar-interests-label">Based on your interests:</span>
            <div className="ar-tag-row">
              {interestTags.map((tag) => (
                <span className="ar-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <button className="ar-refresh-btn">
              <RefreshCw size={14} />
              Refresh Recommendations
            </button>
          </div>

          {/* Recommendations grid */}
          <div className="ar-grid">
            {recommendations.map((course) => (
              <div className="ar-card" key={course.id}>
                <div className="ar-card-image-wrap">
                  <img src={course.image} alt={course.title} />
                  <span className="ar-card-badge">{course.category}</span>
                  <span className="ar-match-badge">
                    <Sparkles size={11} />
                    {course.match}% Match
                  </span>
                </div>
                <div className="ar-card-body">
                  <p className="ar-card-title">{course.title}</p>
                  <p className="ar-card-tutor">{course.tutor}</p>
                  <p className="ar-card-reason">{course.reason}</p>
                  <div className="ar-card-footer">
                    <span className="ar-card-rating">
                      <Star size={13} className="ar-star-icon" />
                      {course.rating} ({course.reviews})
                    </span>
                    <span className="ar-card-price">{course.price}</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="ar-btn ar-btn--primary ar-card-btn"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}