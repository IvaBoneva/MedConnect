import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRouteMine";
import DashboardPatient from "../dashboards/DashboardPatient";
import HomePage from "../pages/HomePage";
import Logout from "../modules/Patient/Logout";
import MainLayout from "../pages/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { useEffect, useState } from "react";
import Some from "../components/Some";

const Routes = () => {
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
          element: token ? <Logout /> : <Navigate to="/" replace />,
        },

        // routes for only authenticated users
        {
          path: "dashboard/patient/*",
          element: (
            <ProtectedRoute>
              <DashboardPatient />
            </ProtectedRoute>
          ),
        },

         {
          path: "restricted/some/",
          element: (
            <Some/>
          ),
        },
      ],
    },
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
