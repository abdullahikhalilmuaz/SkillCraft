import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import TutorProfile from "./pages/TutorProfile";
import Contact from "./pages/Contact";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import Learning from "./pages/student/Learning";
import Quiz from "./pages/student/Quiz";
import QuizResult from "./pages/student/QuizResult";
import AIRecommendations from "./pages/student/AIRecommendations";
import StudentProfile from "./pages/student/StudentProfile";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import MyCertificates from "./pages/student/MyCertificates";
import StudentSettings from "./pages/student/StudentSettings";
import StudentLayout from "./components/StudentLayout";

// Tutor pages
import TutorDashboard from "./pages/tutor/ToturDashboard";
import CreateCourse from "./pages/tutor/CreateCourse";
import EditCourse from "./pages/tutor/EditCourse";
import CourseManagement from "./pages/tutor/CourseManagement";
import QuizManagement from "./pages/tutor/QuizManagement";
import StudentAnalytics from "./pages/tutor/StudentAnalytics";
import TutorLayout from "./components/TutorLayout";
import TutorSettings from "./pages/tutor/TutorSettings";

// Admin pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import TutorApproval from "./pages/admin/TutorApproval";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import Certificates from "./pages/admin/Certificates";
import CertificateView from "./pages/admin/CertificateView";
import Notifications from "./pages/admin/Notifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/tutors/:tutorId" element={<TutorProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student protected routes */}
        <Route element={<ProtectedRoute roles={["student"]} />}>
          {/* Full-screen focused flows (no sidebar) */}
          <Route
            path="/student/learn/:courseId/:lessonId"
            element={<Learning />}
          />
          <Route path="/student/quiz/:quizId" element={<Quiz />} />
          <Route path="/student/quiz/:quizId/result" element={<QuizResult />} />

          {/* Everything else wrapped in StudentLayout */}
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route
              path="/student/recommendations"
              element={<AIRecommendations />}
            />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/quizzes" element={<StudentQuizzes />} />
            <Route path="/student/certificates" element={<MyCertificates />} />
            <Route
              path="/student/certificates/:id"
              element={<CertificateView />}
            />
          </Route>
        </Route>

        {/* Tutor protected routes */}
        <Route element={<ProtectedRoute roles={["tutor"]} />}>
          <Route element={<TutorLayout />}>
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/courses/create" element={<CreateCourse />} />
            <Route
              path="/tutor/courses/:courseId/curriculum"
              element={<CreateCourse />}
            />
            <Route
              path="/tutor/courses/:courseId/edit"
              element={<EditCourse />}
            />
            <Route path="/tutor/courses" element={<CourseManagement />} />
            <Route path="/tutor/quizzes" element={<QuizManagement />} />
            <Route path="/tutor/analytics" element={<StudentAnalytics />} />
            <Route path="/tutor/settings" element={<TutorSettings />} />
          </Route>
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/tutors" element={<TutorApproval />} />
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/categories" element={<ManageCategories />} />
            <Route path="/admin/quizzes" element={<ManageQuizzes />} />
            <Route path="/admin/certificates" element={<Certificates />} />
            <Route
              path="/admin/certificates/:id"
              element={<CertificateView />}
            />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-purple-600">404</h1>
                <p className="mt-4 text-gray-600">Page not found.</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
