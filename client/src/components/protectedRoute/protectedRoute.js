import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const authToken = localStorage.getItem("authToken");
  return authToken ? <Outlet /> : "";
};

export default ProtectedRoute;
