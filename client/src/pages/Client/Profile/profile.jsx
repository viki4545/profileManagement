import React from "react";
import "./profile.css";
import Navbar from "../../../components/Navbar/navbar";

const Profile = ({ isChecked, handleChange }) => {
  return (
    <>
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="profile-main-container">
        <div className="profile-container">
          <div className="profile-header-container">
            <p>My Profile</p>
          </div>
          <div className="profile-content-container">
            <div className="profile-left-content-container"></div>
            <div className="profile-right-content-container"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
