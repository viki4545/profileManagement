import React, { useEffect } from "react";
import "./signup.css";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  clearError,
  userRegisterThunk,
} from "../../../redux/features/userSlice/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Signup = ({ isChecked, handleChange }) => {
  const { t } = useTranslation();

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const error = useSelector((state) => state.rootReducer.userInfo.error);
  const loading = useSelector((state) => state.rootReducer.userInfo.loading);

  const createUser = useFormik({
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
        .matches(/[^\w]/, "Password requires a symbol")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(userRegisterThunk(values))
        .then((data) => {
          if (data.payload) {
            toast.success("User Registered successfully");
            navigate("/user/login");
          } else {
            toast.error("Failed to registered the user");
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <ToastContainer />
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="signup-main-container">
        <div className="signup-container">
          <div className="signup-header-container">
            <h1>{t("signup")}</h1>
          </div>
          <div className="signup-content-container">
            <form onSubmit={createUser.handleSubmit}>
              <div className="signup-email-container">
                <label htmlFor="email">{t("EmailAddress")}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={createUser.handleChange}
                  onBlur={createUser.handleBlur}
                  value={createUser.values.email}
                />
                {createUser.touched.email && createUser.errors.email ? (
                  <div id="input-errors">{createUser.errors.email}</div>
                ) : null}
              </div>

              <div className="signup-password-container">
                <label htmlFor="password">{t("Password")}</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={createUser.handleChange}
                  onBlur={createUser.handleBlur}
                  value={createUser.values.password}
                />
                {createUser.touched.password && createUser.errors.password ? (
                  <div id="input-errors">{createUser.errors.password}</div>
                ) : null}
              </div>

              <div className="signup-cnf-password-container">
                <label htmlFor="confirmPassword">{t("ConfirmPassword")}</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={createUser.handleChange}
                  onBlur={createUser.handleBlur}
                  value={createUser.values.confirmPassword}
                />
                {createUser.touched.confirmPassword &&
                createUser.errors.confirmPassword ? (
                  <div id="input-errors">
                    {createUser.errors.confirmPassword}
                  </div>
                ) : null}
              </div>

              <button
                type="submit"
                onClick={createUser.handleSubmit}
                disabled={loading}
              >
                {t("Submit")}
              </button>
              <p className="already-have-account">
                {t("Already have an account?")}{" "}
                <a href="/user/login">{t("login")}</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
