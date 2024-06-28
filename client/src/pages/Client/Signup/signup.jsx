import React from "react";
import "./signup.css";
import * as Yup from "yup";
import Navbar from "../../../components/Navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { userRegisterThunk } from "../../../redux/features/userSlice/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { auth } from "../../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { storage, db } from "../../../firebase";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Signup = ({ isChecked, handleChange }) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
      })
        .then(() => {
          toast.success("user created successfully");
          navigate("/login");
        })
        .catch(() => toast.error("user not created"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const createUser = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
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
      name: Yup.string().required("Please enter your name"),
    }),
    onSubmit: (values) => {
      let userData = {
        email: values.email,
        password: values.password,
        name: values.name,
      };
      dispatch(userRegisterThunk(userData)).then(() => {
        handleSignup(userData.email, userData.password);
      });
    },
  });

  return (
    <>
      <ToastContainer />
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="signup-main-container">
        <div className="signup-container">
          <div className="signup-header-container">
            <h1>Sign Up</h1>
          </div>
          <div className="signup-content-container">
            <form onSubmit={createUser.handleSubmit}>
              <div className="signup-cnf-password-container">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={createUser.handleChange}
                  onBlur={createUser.handleBlur}
                  value={createUser.values.name}
                />
                {createUser.touched.name && createUser.errors.name ? (
                  <div id="input-errors">{createUser.errors.name}</div>
                ) : null}
              </div>
              <div className="signup-email-container">
                <label htmlFor="email">Email Address</label>
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
                <label htmlFor="password">Password</label>
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

              <button type="submit" onClick={createUser.handleSubmit}>
                Submit
              </button>
              <p className="already-have-account">
                Already have an account ? <a href="/login">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
