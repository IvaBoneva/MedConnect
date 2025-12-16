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
import { useEffect, useState } from "react";
import PaymentSuccess from "../features/subscriptions/PaymentSuccess";
import { DoctorPersonalDetails } from "../features/doctors/DoctorPersonalDetails";

const Routes = () => {
  const { user } = useAuth();
  const { token } = useAuth();

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, [token]);

  if (!isReady) return null;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },

        {
          path: "login",
          element: token ? <Navigate to="/" replace /> : <LoginPage />,
        },
        {
          path: "register",
          element: token ? <Navigate to="/" replace /> : <RegisterPage />,
        },
        {
          path: "logout",
          element: token ? <LogoutPage /> : <Navigate to="/" replace />,
        },

        {
          path: "dashboard/*",
          element: (
            <ProtectedRoute>
              {/* Redirect to role-specific dashboard */}
              <Navigate
                to={
                  user?.role === "patient"
                    ? "/dashboard/patient"
                    : user?.role === "doctor"
                    ? "/dashboard/doctor"
                    : user?.role === "guardian"
                    ? "/dashboard/guardian"
                    : "/login"
                }
                replace
              />
            </ProtectedRoute>
          ),
        },

        // routes for only authenticated users
        {
          path: "dashboard/patient/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["patient"]}>
              <DashboardPatient />
            </ProtectedRoleRoute>
          ),
        },
        {
          path: "dashboard/doctor/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["doctor"]}>
              <DashboardDoctor />
            </ProtectedRoleRoute>
          ),
        },
        {
          path: "dashboard/guardian/*",
          element: (
            <ProtectedRoleRoute allowedRoles={["guardian"]}>
              <DashboardGuardian />
            </ProtectedRoleRoute>
          ),
        },

        {
          path: "payment-success",
          element: <PaymentSuccess />,
        },

        // NEWLY ADDED
        {
          path: "doctor/:slug", // Dynamic route with slug
          element: <DoctorPersonalDetails />, // New component to show doctor details
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
