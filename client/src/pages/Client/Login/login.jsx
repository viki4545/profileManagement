import React from "react";
import "./login.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";

const Login = ({ isChecked, handleChange }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
  });

  return (
    <>
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="login-main-container">
        <div className="login-container">
          <div className="login-header-container">
            <h1>Login</h1>
          </div>
          <div className="login-content-container">
            <form onSubmit={formik.handleSubmit}>
              <div className="login-email-container">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div id="input-errors">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="login-password-container">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div id="input-errors">{formik.errors.password}</div>
                ) : null}
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
