import React, { useState } from "react";
import "./adminlogin.css";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { userLoginThunk } from "../../../redux/features/userSlice/userSlice";

const Adminlogin = ({ isChecked, handleChange }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState();

  const handleLogin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        toast.success("User logged in successfully!");
        setUserId(user.uid);
        navigate(`/admin/dashboard`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
      let userData = {
        email: values.email,
        password: values.password,
      };
      dispatch(userLoginThunk(userData)).then((data) => {
        const email = data.payload.email;
        const password = data.payload.password;
        handleLogin({ email, password });
      });
    },
  });

  return (
    <>
      <ToastContainer />
      <Navbar
        isChecked={isChecked}
        handleChange={handleChange}
        userId={userId}
      />
      <div className="login-main-container">
        <div className="login-container">
          <div className="login-header-container">
            <h2>Admin Login</h2>
          </div>
          <div className="login-content-container">
            <form onSubmit={userLogin.handleSubmit}>
              <div className="login-email-container">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="password">Password</label>
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

              <button type="submit">Submit</button>
              <p className="create-an-account">
                Don't have an account?
                <a href="/admin/signup">Register</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminlogin;
