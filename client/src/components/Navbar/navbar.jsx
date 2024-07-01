import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import Toggle from "../Toggle/toggle";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice/userSlice";
import { ToastContainer, toast } from "react-toastify";
import LanguageSwitcher from "../LanguageSwitcher/languageSwitcher";

const Navbar = ({ isChecked, handleChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(logout());
    navigate("/user/login");
  };

  return (
    <>
      <ToastContainer />
      <div className="navbar-main-container">
        <div className="navbar-left-container">
          <h1>upliance.ai</h1>
        </div>
        <div className="navbar-right-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
          <LanguageSwitcher />
          {authToken ? <RiLogoutBoxRLine onClick={handleLogout} /> : ""}
        </div>
        <div className="navbar-mob-toggle-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
          <LanguageSwitcher />
          {authToken ? <RiLogoutBoxRLine onClick={handleLogout} /> : ""}
        </div>
      </div>
    </>
  );
};

export default Navbar;
