import React from "react";
import { Navigate, Outlet } from "react-router-dom";



const PublicRoute: React.FC = () => {
  const user = localStorage.getItem("user");

  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
