import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ProtectedRoleRoute } from "./ProtectedRoleRoute";
import { ProtectedRoute } from "./ProtectedRoutes";
import DashboardPatient from "../features/dashboards/patient/PatientDashboardPage";
import DashboardDoctor from "../features/dashboards/doctor/DoctorDashboardPage";
import DashboardGuardian from "../features/dashboards/guardian/GuardianDashboardPage";
import HomePage from "../features/home/HomePage";
import LogoutPage from "../features/auth/components/LogoutPage";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../features/auth/LoginForm";
import RegisterPage from "../features/auth/RegisterForm";
import { useEffect, useState } from "react";
import PaymentSuccess from "../features/subscriptions/PaymentSuccess";
import { DoctorPersonalDetails } from "../features/doctors/DoctorPersonalDetails";
import AdminLogin from "../modules/Admin/AdminLogin";
import AdminPanel from "../modules/Admin/AdminPanel";

const Routes = () => {
  const { user, token } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(true), [token]);
  if (!isReady) return null;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: token ? <Navigate to="/" replace /> : <LoginPage /> },
        { path: "register", element: token ? <Navigate to="/" replace /> : <RegisterPage /> },
        { path: "logout", element: token ? <LogoutPage /> : <Navigate to="/" replace /> },

        // Admin routes
        { path: "admin/login", element: user?.role === "admin" ? <Navigate to="/admin" replace /> : <AdminLogin /> },
        {
          path: "admin",
          element: (
            <ProtectedRoleRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoleRoute>
          ),
        },

        // Redirect dashboard based on role
        {
          path: "dashboard/*",
          element: (
            <ProtectedRoute>
              <Navigate
                to={
                  user?.role === "patient"
                    ? "/dashboard/patient"
                    : user?.role === "doctor"
                    ? "/dashboard/doctor"
                    : user?.role === "guardian"
                    ? "/dashboard/guardian"
                    : user?.role === "admin"
                    ? "/admin"
                    : "/login"
                }
                replace
              />
            </ProtectedRoute>
          ),
        },

<<<<<<< HEAD
        { path: "dashboard/patient/*", element: <ProtectedRoleRoute allowedRoles={["patient"]}><DashboardPatient /></ProtectedRoleRoute> },
        { path: "dashboard/doctor/*", element: <ProtectedRoleRoute allowedRoles={["doctor"]}><DashboardDoctor /></ProtectedRoleRoute> },
        { path: "dashboard/guardian/*", element: <ProtectedRoleRoute allowedRoles={["guardian"]}><DashboardGuardian /></ProtectedRoleRoute> },

        { path: "payment-success", element: <PaymentSuccess /> },
        { path: "doctor/:slug", element: <DoctorPersonalDetails /> },
=======
        {
          path: "dashboard/patient/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["patient"]}>
              <DashboardPatient />
            </ProtectedRoleRoute>
          ),
          errorElement: <ErrorPage />,
        },
        {
          path: "dashboard/doctor/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["doctor"]}>
              <DashboardDoctor />
            </ProtectedRoleRoute>
          ),
          errorElement: <ErrorPage />,
        },
        {
          path: "dashboard/guardian/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["guardian"]}>
              <DashboardGuardian />
            </ProtectedRoleRoute>
          ),
          errorElement: <ErrorPage />,
        },

        {
          path: "payment-success",
          element: <PaymentSuccess />,
          errorElement: <ErrorPage />,
        },

        {
          path: "doctor/:slug", 
          element: <DoctorPersonalDetails />, 
          errorElement: <ErrorPage />,
        },
>>>>>>> 98b16e23575f8da0abb60ebd5119ae8a1c41d642
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
