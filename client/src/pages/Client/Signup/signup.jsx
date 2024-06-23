import React from "react";
import "./signup.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";

const Signup = ({ isChecked, handleChange }) => {
  //   const phoneRegExp =
  //     /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .matches(passwordRules, {
          message: "Please create a stronger password",
        })
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
  });

  return (
    <>
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="signup-main-container">
        <div className="signup-container">
          <div className="signup-header-container">
            <h1>Sign Up</h1>
          </div>
          <div className="signup-content-container">
            <form onSubmit={formik.handleSubmit}>
              <div className="signup-email-container">
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

              <div className="signup-password-container">
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

              <div className="signup-cnf-password-container">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div id="input-errors">{formik.errors.confirmPassword}</div>
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

export default Signup;
