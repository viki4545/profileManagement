import React, { useState } from "react";
import "./adminAccess.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";

const Adminaccess = ({ isChecked, handleChange }) => {
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
      <div className="admin-access-main-container"></div>
    </>
  );
};

export default Adminaccess;
