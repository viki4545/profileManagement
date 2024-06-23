import React from "react";
import "./adminlogin.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toggle from "../../../components/Toggle/toggle";

const Adminlogin = ({ isChecked, handleChange }) => {
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
      <div className="admin-login-container">
        <div className="admin-login-toggle-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
        </div>
        <div className="admin-login-content-container">
          <div className="admin-login-header-container">
            <h1>Login</h1>
          </div>
          <div className="admin-login-input-container">
            <form onSubmit={formik.handleSubmit}>
              <div className="admin-login-email-container">
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

              <div className="admin-login-password-container">
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

export default Adminlogin;
