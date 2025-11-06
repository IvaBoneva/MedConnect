// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import DashboardPatient from "./dashboards/DashboardPatient";
import DashboardDoctor from "./dashboards/DashboardDoctor";
import DashboardGuardian from "./dashboards/DashboardGuardian";
import DashboardAdmin from "./dashboards/DashboardAdmin";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        {/* Публични маршрути */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Главен защитен маршрут */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Отделни пътища за всяка роля (ако влизаме директно) */}
        <Route
          path="/dashboard/patient/*"
          element={
            <ProtectedRoute>
              <DashboardPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/doctor/*"
          element={
            <ProtectedRoute>
              <DashboardDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/guardian/*"
          element={
            <ProtectedRoute>
              <DashboardGuardian />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        {/*Тестови маршрути (временни, без ProtectedRoute) */}
        <Route path="/test/patient/*" element={<DashboardPatient />} />
        <Route path="/test/doctor/*" element={<DashboardDoctor />} />
      </Routes>
    </Router>
  );
}

export default App;
