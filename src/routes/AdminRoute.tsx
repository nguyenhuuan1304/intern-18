import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute: React.FC = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
  
    return  (!user || user.username !== "admin") ? <Navigate to="/" replace /> :  <Outlet />;
       
  
  };
  
  export default AdminRoute;
  