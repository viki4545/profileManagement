import React, { useEffect, useState } from "react";
import "./login.css";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  clearError,
  userLoginThunk,
} from "../../../redux/features/userSlice/userSlice";
import { useTranslation } from "react-i18next";

const Login = ({ isChecked, handleChange }) => {
  const { t } = useTranslation();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector((state) => state.rootReducer.userInfo.error);
  const loading = useSelector((state) => state.rootReducer.userInfo.loading);
  const isLoggedIn = useSelector(
    (state) => state.rootReducer.userInfo.isLoggedIn
  );

  const userLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(8, "Password must be 8 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol"),
    }),
    onSubmit: (values) => {
      dispatch(userLoginThunk(values)).then((data) => {
        if (data.payload.authToken || isLoggedIn) {
          navigate(`/user/profile/${data.payload.uid}`);
        }
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <>
      <ToastContainer />
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="login-main-container">
        <div className="login-container">
          <div className="login-header-container">
            <h2>{t("login")}</h2>
          </div>
          <div className="login-content-container">
            <form onSubmit={userLogin.handleSubmit}>
              <div className="login-email-container">
                <label htmlFor="email">{t("EmailAddress")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={userLogin.handleChange}
                  onBlur={userLogin.handleBlur}
                  value={userLogin.values.email}
                />
                {userLogin.touched.email && userLogin.errors.email ? (
                  <div id="input-errors">{userLogin.errors.email}</div>
                ) : null}
              </div>

              <div className="login-password-container">
                <label htmlFor="password">{t("Password")}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={userLogin.handleChange}
                  onBlur={userLogin.handleBlur}
                  value={userLogin.values.password}
                />
                {userLogin.touched.password && userLogin.errors.password ? (
                  <div id="input-errors">{userLogin.errors.password}</div>
                ) : null}
              </div>

              <button type="submit">{t("Submit")}</button>
              <p className="create-an-account">
                {t("Don't have an account?")}
                <a href="/user/signup">{t("Register")}</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
