import  { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoutes";

const HomePage = lazy(() => import("../pages/HomePage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const CategoryMobile = lazy(
  () => import("../pages/categoryMoblie/categoryMobile")
);
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));

const Account = lazy(() => import("../pages/account/Account"));
const Order = lazy(() => import("../pages/order/Order"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/product",
    element: <ProductPage />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/danh-muc-san-pham",
    element: <CategoryMobile />,
  },
  {
    element: <PublicRoute />,
    children: [
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
      {
        path: "/reset",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/account",
        element: <Account />,
        children: [
          {
            path: "order",
            element: <Order />,
          },
        ],
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
    ],
    // path: "/cart",
    // element: (
    //     <CartPage />
    // ),
  },
  {
    path: "/contact",
    element: (
        <Contact />
    ),
  },
  {
    path: "/danh-muc-san-pham",
    element: (
        <CategoryMobile/>
    ),
  },
  {
    path: "/product-detail/:documentId",
    element: (
    <ProductDetailPage />
    ),
  },
];
