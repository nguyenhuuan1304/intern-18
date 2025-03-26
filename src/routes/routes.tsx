import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import DetailProductNews from "@/pages/detailProductNews/DetailProductNews";
const NotFound = lazy(() => import( "@/components/Notfound")) ;
const PrivateRoute = lazy(() => import("./PrivateRoutes"));
const PublicRoute = lazy(() => import("./PublicRoutes"));
const HomePage = lazy(() => import("../pages/HomePage"));
const Account = lazy(() => import("../pages/account/Account"));
const Order = lazy(() => import("../pages/order/Order"));
const Payment = lazy(() => import("../pages/payment/Payment"));
const News = lazy(() => import("../pages/news/News"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const Contact = lazy(() => import("../pages/contact/Contact"));
const CategoryMobile = lazy(
  () => import("../pages/categoryMoblie/categoryMobile")
);
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));

const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
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
    path: "product/:categorySlug",
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
      <CategoryMobile />
    ),
  },
  {
    path: "/tin-tuc",
    element: (
      <News />
    )
  }
  ,
  // {
  //   path: ":slug",
  //   element: (
  //     <DetailProduct
  //       category='Tin Tức'
  //     />
  //   ),

  //   element: <PrivateRoute />,
  //   children: [
  //     {
  //       path: "/account",
  //       element: <Account />,
  //       children: [
  //         {
  //           path: "order",
  //           element: <Order />,
  //         },
  //       ],
  //     },
  //     {
  //       path: "/cart",
  //       element: <CartPage />,
  //     },
  //   ],
  // },
  {
    path: "/product-detail/:documentId",
    element: (
      <ProductDetailPage />
    ),


    // element: <Payment />,
  },
  {
    path: "/lien-he",
    element: <Contact />,
  },
  {
    path: "/tin-tuc",
    element: <News />,
  },
  {
    path: ":slug",
    element: <DetailProductNews category="tin-tuc"/>,
  },
  {
    // element: <PrivateRoute />,
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
  },
  {
    path: "/notfound",
    element: <NotFound />,

  },
];
