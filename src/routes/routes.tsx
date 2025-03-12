import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot",
    element: <ForgotPasswordPage />,
  },
];
