import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./pages/UserDashboard";
import TheaterPage from "./pages/TheaterPage";


function App() {
  const location = useLocation();

  // ✅ Hide Navbar + Footer on Dashboard and MovieDetails pages
  const hideNavbarFooter =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/movies/");

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <div className={!hideNavbarFooter ? "container my-4" : ""}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Theaters section (moved inside <Routes>) */}
          <Route path="/theaters" element={<TheaterPage />} />
          

          {/* ✅ Always keep NotFoundPage last */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default App;
