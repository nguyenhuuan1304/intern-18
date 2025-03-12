import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));
const Account = lazy(() => import("../pages/account/Account"));
const Order = lazy(() => import("../pages/order/Order"));
const Login = lazy(() => import("../pages/login/Login"));
const Payment = lazy(() => import("../pages/payment/Payment"));
const Product = lazy(() => import("../pages/product/Product"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const CategoryMobile = lazy(() => import("../pages/categoryMoblie/categoryMobile"));





export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
        <HomePage />
    ),
  },
  {
    path: "/account",
    element: (
        <Account />
    ),
    children: [
      {
        path: "order",
        element: <Order />,
      },
    ],
  },
  {
    path: "/login",
    element: (
        <Login />
    ),
  },
  {
    path: "/thanh-toan",
    element: (
        <Payment />
    ),
  },
  {
    path: "/san-pham",
    element: (
        <Product />
    ),
  },
  {
    path: "/lien-he",
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
  
  
];
