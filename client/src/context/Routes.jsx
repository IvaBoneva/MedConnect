import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
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

import PaymentSuccess from "../features/subscriptions/PaymentSuccess";
import { DoctorPersonalDetails } from "../features/doctors/DoctorPersonalDetails";

import AdminLogin from "../modules/Admin/AdminLogin";
import AdminPanel from "../modules/Admin/AdminPanel";
import ErrorPage from "./ErrorPage";

import { useEffect, useState } from "react";

const Routes = () => {
  const { user, token } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => setIsReady(true), [token]);
  if (!isReady) return null;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },

        { path: "login", element: token ? <Navigate to="/" /> : <LoginPage /> },
        { path: "register", element: token ? <Navigate to="/" /> : <RegisterPage /> },
        { path: "logout", element: token ? <LogoutPage /> : <Navigate to="/" /> },
        {
          path: "admin/login",
          element: user?.role === "admin" 
            ? <Navigate to="/admin" replace />
            : <AdminLogin />
        },

        {
          path: "admin",
          element: (
            <ProtectedRoleRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoleRoute>
          ),
          children: [
            { index: true, element: <div>Изберете секция от менюто</div> },
            { path: "users", element: <div>Users page</div> },
            { path: "doctors", element: <div>Doctors page</div> },
            { path: "appointments", element: <div>Appointments page</div> },
            { path: "reviews", element: <div>Reviews page</div> },
            { path: "*", element: <ErrorPage /> },
          ],
        },

        // Dashboard redirect
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

        { path: "dashboard/patient/*", element: <ProtectedRoleRoute allowedRoles={["patient"]}><DashboardPatient /></ProtectedRoleRoute> },
        { path: "dashboard/doctor/*", element: <ProtectedRoleRoute allowedRoles={["doctor"]}><DashboardDoctor /></ProtectedRoleRoute> },
        { path: "dashboard/guardian/*", element: <ProtectedRoleRoute allowedRoles={["guardian"]}><DashboardGuardian /></ProtectedRoleRoute> },

        { path: "payment-success", element: <PaymentSuccess /> },
        { path: "doctor/:slug", element: <DoctorPersonalDetails /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
