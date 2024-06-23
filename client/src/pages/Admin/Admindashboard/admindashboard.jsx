import React, { useState } from "react";
import "./admindashboard.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";

const Admindashboard = ({ isChecked, handleChange }) => {
  const [isSidebar, setIsSidebar] = useState(false);
  return (
    <>
      <Adminnavbar
        isChecked={isChecked}
        handleChange={handleChange}
        handleSidebar={() => setIsSidebar(!isSidebar)}
      />
      {isSidebar && (
        <Adminsidebar handleSidebar={() => setIsSidebar(!isSidebar)} />
      )}
      <div className="admin-dashboard-main-container"></div>
    </>
  );
};

export default Admindashboard;
