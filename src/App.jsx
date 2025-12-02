// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function AppContent() {
  const location = useLocation();

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
          <Route path="/book" element={<SeatSelectionPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
         <Route path="/confirmation" element={<ConfirmationPage />} />
        
<Route path="/payment" element={<PaymentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile/me"
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
          <Route path="/theaters" element={<TheaterPage />} />
          <Route path="/book" element={<SeatSelectionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
       
      </div>

      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    // ✅ AuthProvider only here — Router is handled in index.js
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
