import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ProtectedRoleRoute } from "./ProtectedRoleRoute";
import { ProtectedRoute } from "./ProtectedRoutes";
import DashboardPatient from "../dashboards/DashboardPatient";
import DashboardDoctor from "../dashboards/DashboardDoctor";
import DashboardGuardian from "../dashboards/DashboardGuardian";
import HomePage from "../pages/HomePage";
import LogoutPage from "../pages/LogoutPage";
import MainLayout from "../pages/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useEffect, useState } from "react";
import PaymentSuccess from "../pages/PaymentSuccess";

const Routes = () => {
  const { user } = useAuth();
  const { token } = useAuth();

  // ✅ Add a small hydration delay so the router waits for AuthContext to initialize
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(true);
  }, [token]);

  if (!isReady) return null;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />, // Wrap Navbar above the page
      children: [
        // Public routes
        { index: true, element: <HomePage /> },

        {
          //   redirect already loged in users
          path: "login",
          element: token ? <Navigate to="/" replace /> : <LoginPage />,
        },
        {
          // same here
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
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
