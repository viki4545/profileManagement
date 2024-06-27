import React, { useState } from "react";
import "./adminSidebar.css";
import { RxCross2 } from "react-icons/rx";

const Adminsidebar = ({ handleSidebar }) => {
  return (
    <>
      <div className="admin-sidebar-main-container">
        <div className="admin-sidebar-header-container">
          <div className="admin-ham-menu-container" onClick={handleSidebar}>
            <RxCross2 />
          </div>
          <h1>upliance.ai</h1>
        </div>
        <div className="admin-sidebar-link-container">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/access">Adminaccess</a>
        </div>
      </div>
    </>
  );
};

export default Adminsidebar;
