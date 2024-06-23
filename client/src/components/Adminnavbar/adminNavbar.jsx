import React from "react";
import "./adminNavbar.css";
import Toggle from "../Toggle/toggle";
import { RxHamburgerMenu } from "react-icons/rx";

const Adminnavbar = ({ isChecked, handleChange, handleSidebar }) => {
  return (
    <>
      <div className="admin-navbar-container">
        <div className="admin-navbar-left-container">
          <div className="admin-ham-menu-container" onClick={handleSidebar}>
            <RxHamburgerMenu />
          </div>
          <h1>upliance.ai</h1>
        </div>
        <div className="admin-navbar-right-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
        </div>
      </div>
    </>
  );
};

export default Adminnavbar;
