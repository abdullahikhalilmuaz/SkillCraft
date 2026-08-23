import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route element={<ProtectedRoute roles={["student"]} />}>
          <Route
            path="/student/dashboard"
            element={<div>Student Dashboard</div>}
          />
        </Route>

        {/* Tutor */}
        <Route element={<ProtectedRoute roles={["tutor"]} />}>
          <Route path="/tutor/dashboard" element={<div>Tutor Dashboard</div>} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
