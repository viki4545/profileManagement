import React, { useState } from "react";
import "./allUsers.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";

const AllUsers = ({ isChecked, handleChange }) => {
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
      <div className="admin-users-data-main-container"></div>
    </>
  );
};

export default AllUsers;
