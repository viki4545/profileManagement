import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import Toggle from "../Toggle/toggle";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";

const Navbar = ({ isChecked, handleChange, userId }) => {
  const [isMenu, setIsMenu] = useState(false);

  const isLogin = useSelector((state) => state.rootReducer.userInfo.isLogin);

  const { currentUser } = useAuth();

  console.log(currentUser);

  return (
    <>
      <div className="navbar-main-container">
        <div className="navbar-left-container">
          <h1>upliance.ai</h1>
        </div>
        <div className="navbar-right-container">
          <Toggle isChecked={isChecked} handleChange={handleChange} />
          {isLogin === true ? (
            <>
              <a href="">logout</a>
            </>
          ) : (
            <>
              <a href="/signup">Signup</a>
              <a href="/login">Login</a>
            </>
          )}
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
          {isLogin === true ? (
            <a href="">logout</a>
          ) : (
            <>
              <a href="/signup">Signup</a>
              <a href="/login">Login</a>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
