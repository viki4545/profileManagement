import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import Toggle from "../Toggle/toggle";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

const Navbar = ({ isChecked, handleChange }) => {
  const [isMenu, setIsMenu] = useState(false);
  return (
    <>
      <div className="navbar-main-container">
        <div className="navbar-left-container">
          <h1>upliance.ai</h1>
        </div>
        <div className="navbar-right-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
          <a href="/home">Home</a>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
          <a href="/profile">MyProfile</a>
        </div>
        <div className="navbar-mob-toggle-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
        </div>
        <div
          className="navbar-ham-icon-container"
          onClick={() => setIsMenu(!isMenu)}
        >
          {isMenu ? <RxCross2 /> : <RxHamburgerMenu />}
        </div>
      </div>
      {isMenu && (
        <div className="navbar-ham-menu-container">
          <a href="/home">Home</a>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
          <a href="/profile">MyProfile</a>
        </div>
      )}
    </>
  );
};

export default Navbar;
