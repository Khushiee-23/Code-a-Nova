
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";



function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/register" element={<Registration />} />
</Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
