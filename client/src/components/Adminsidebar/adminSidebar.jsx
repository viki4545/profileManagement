import React, { useState } from "react";
import "./adminSidebar.css";
import { RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";

const Adminsidebar = ({ handleSidebar }) => {
  const { t } = useTranslation();

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
          <a href="/admin/dashboard">{t("Dashboard")}</a>
          <a href="/admin/users">{t("Users")}</a>
          <a href="/admin/access">{t("Adminaccess")}</a>
        </div>
      </div>
    </>
  );
};

export default Adminsidebar;
