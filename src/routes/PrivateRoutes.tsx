import React from "react";
import { Navigate, Outlet } from "react-router-dom";



const PrivateRoute: React.FC = () => {
  const user = localStorage.getItem("user");

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
