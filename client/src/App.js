import React, { useState } from "react";
import useLocalStorage from "use-local-storage";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Client/Signup/signup.jsx";
import Login from "./pages/Client/Login/login.jsx";
import Profile from "./pages/Client/Profile/profile.jsx";
import Adminlogin from "./pages/Admin/Adminlogin/adminlogin.jsx";
import Admindashboard from "./pages/Admin/Admindashboard/admindashboard.jsx";
import AllUsers from "./pages/Admin/AllUsers/allUsers.jsx";
import Adminaccess from "./pages/Admin/Adminaccess/adminAccess.jsx";
import ProtectedRoute from "./components/protectedRoute/protectedRoute.js";
import Adminsignup from "./pages/Admin/Adminsignup/adminsignup.jsx";
import Userdetails from "./pages/Admin/Userdetails/userdetails.jsx";
import AdminprotectedRoute from "./components/protectedRoute/adminProtectedRoute.js";

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/user/login"
            element={
              <Login
                isChecked={isDark}
                handleChange={() => setIsDark(!isDark)}
              />
            }
          />
          <Route
            path="/user/signup"
            element={
              <Signup
                isChecked={isDark}
                handleChange={() => setIsDark(!isDark)}
              />
            }
          />
          <Route
            path="/admin/login"
            element={
              <Adminlogin
                isChecked={isDark}
                handleChange={() => setIsDark(!isDark)}
              />
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/user/profile/:id"
              element={
                <Profile
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />
          </Route>
          <Route element={<AdminprotectedRoute />}>
            <Route
              path="/admin/users/:id"
              element={
                <Userdetails
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />
            <Route
              path="/admin/addAdmin"
              element={
                <Adminsignup
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <Admindashboard
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />

            <Route
              path="/admin/users"
              element={
                <AllUsers
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />

            <Route
              path="/admin/access"
              element={
                <Adminaccess
                  isChecked={isDark}
                  handleChange={() => setIsDark(!isDark)}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
