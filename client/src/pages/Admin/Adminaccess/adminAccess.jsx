import React, { useEffect, useState } from "react";
import "./adminAccess.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  getAdminUsersThunk,
} from "../../../redux/features/adminSlice/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Adminaccess = ({ isChecked, handleChange }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebar, setIsSidebar] = useState(false);

  const error = useSelector((state) => state.rootReducer.adminInfo.error);
  const loading = useSelector((state) => state.rootReducer.adminInfo.loading);
  const adminData = useSelector(
    (state) => state.rootReducer.adminInfo.adminData
  );

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/admin/login");
    } else {
      dispatch(getAdminUsersThunk()).then((data) => {
        if (data.payload) {
          toast.success("Admin data fetched successfully");
        } else {
          toast.error("Failed to fetch admin data");
        }
      });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <ToastContainer />
      <Adminnavbar
        isChecked={isChecked}
        handleChange={handleChange}
        handleSidebar={() => setIsSidebar(!isSidebar)}
      />
      {isSidebar && (
        <Adminsidebar handleSidebar={() => setIsSidebar(!isSidebar)} />
      )}
      <div className="admin-access-main-container">
        <div className="admin-access-content-container">
          <div className="admin-access-inner-content-container">
            <div className="admin-access-label-container">
              <label htmlFor="phone">{t("Id")}</label>
              <label htmlFor="code">{t("Email")}</label>
            </div>
            {adminData?.map((data, idx) => (
              <div key={idx} className="admin-access-row-container">
                <div className="admin-access-left-row-container">
                  <input
                    type="text"
                    name="id"
                    id="id"
                    value={data.uid}
                    disabled
                  />
                </div>
                <div className="admin-access-right-row-container">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={data.email}
                    disabled
                  />
                </div>
              </div>
            ))}
            <div className="admin-access-add-btn-container">
              <a href="/admin/addAdmin">{t("Add admin")} +</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminaccess;
