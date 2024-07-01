import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";

const AdminprotectedRoute = ({ element: Element, ...rest }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? <Outlet /> : <Navigate to={"/admin/login"} />;
};

export default AdminprotectedRoute;
