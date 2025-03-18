import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DetailProduct from "@/pages/detailProduct/DetailProduct";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));
const Account = lazy(() => import("../pages/account/Account"));
const Order = lazy(() => import("../pages/order/Order"));
const Payment = lazy(() => import("../pages/payment/Payment"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const CategoryMobile = lazy(() => import("../pages/categoryMoblie/categoryMobile"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const News = lazy(() => import("../pages/news/News"));


export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <HomePage />
    ),
  },
  {
    path: "/product",
    element: (
      <ProductPage />
    ),
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
    path: "/thanh-toan",
    element: (
        <Payment />
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
  {
    path: "/tin-tuc",
    element: (
        <News/>
    )
  }
  ,
  {
    path: ":slug",
    element: (
        <DetailProduct
          category = 'Tin Tức'
        />
    ),
  },
];
