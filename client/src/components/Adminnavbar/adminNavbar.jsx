import React, { useEffect } from "react";
import "./adminNavbar.css";
import Toggle from "../Toggle/toggle";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { adminLogout } from "../../redux/features/adminSlice/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher/languageSwitcher";

const Adminnavbar = ({ isChecked, handleChange, handleSidebar }) => {
  let dispatch = useDispatch();
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("authToken");
  //   if (!storedToken) {
  //     navigate("/admin/login");
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  return (
    <>
      <ToastContainer />
      <div className="admin-navbar-container">
        <div className="admin-navbar-left-container">
          <div className="admin-ham-menu-container" onClick={handleSidebar}>
            <RxHamburgerMenu />
          </div>
          <h1>upliance.ai</h1>
        </div>
        <div className="admin-navbar-right-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
          <LanguageSwitcher />

          {authToken && <RiLogoutBoxRLine onClick={handleLogout} />}
        </div>
      </div>
    </>
  );
};

export default Adminnavbar;
