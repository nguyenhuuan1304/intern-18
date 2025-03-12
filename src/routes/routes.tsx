import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const HomePage = lazy(() => import("../pages/HomePage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));

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
];
