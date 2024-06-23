import React from "react";
import "./home.css";
import Navbar from "../../../components/Navbar/navbar";

const Home = ({ isChecked, handleChange }) => {
  return (
    <>
      <Navbar isChecked={isChecked} handleChange={handleChange} />
      <div className="home-content-container">
        <h1>Hello World from upliance.ai !</h1>
      </div>
    </>
  );
};

export default Home;
