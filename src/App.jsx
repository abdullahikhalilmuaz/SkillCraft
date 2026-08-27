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

// Tutor pages
import TutorDashboard from "./pages/tutor/ToturDashboard";
import CreateCourse from "./pages/tutor/CreateCourse";
import EditCourse from "./pages/tutor/EditCourse";
import CourseManagement from "./pages/tutor/CourseManagement";
import QuizManagement from "./pages/tutor/QuizManagement";
import StudentAnalytics from "./pages/tutor/StudentAnalytics";

// Admin pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserManagement from "./pages/admin/UserManagement";
// import TutorApproval from "./pages/admin/TutorApproval";
// import CourseApproval from "./pages/admin/CourseApproval";
// import PlatformAnalytics from "./pages/admin/PlatformAnalytics";

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
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<MyCourses />} />
          <Route
            path="/student/learn/:courseId/:lessonId"
            element={<Learning />}
          />
          <Route path="/student/quiz/:quizId" element={<Quiz />} />
          <Route path="/student/quiz/:quizId/result" element={<QuizResult />} />
          <Route
            path="/student/recommendations"
            element={<AIRecommendations />}
          />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/quizzes" element={<StudentQuizzes />} />
        </Route>

        {/* Tutor protected routes */}
        <Route element={<ProtectedRoute roles={["tutor", "admin"]} />}>
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
        </Route>

        {/* Admin protected routes (commented out) */}
        {/* <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/tutors" element={<TutorApproval />} />
          <Route path="/admin/courses" element={<CourseApproval />} />
          <Route path="/admin/analytics" element={<PlatformAnalytics />} />
        </Route> */}

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
