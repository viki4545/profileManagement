import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "../../../components/Chart/chart";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import "./admindashboard.css";
import {
  clearError,
  getApiDataThunk,
} from "../../../redux/features/adminSlice/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Admindashboard = ({ isChecked, handleChange }) => {
  const { t } = useTranslation();

  let dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.rootReducer.adminInfo);

  const error = useSelector((state) => state.rootReducer.adminInfo.error);

  const [isSidebar, setIsSidebar] = useState(false);
  const [view, setView] = useState("line");
  const views = ["line", "bar", "pie", "dougnut"];

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
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content-container">
          <div className="admin-dashboard-inner-content-container">
            <h1>{t("Data Visualization Dashboard")}</h1>
            <div className="admin-dashboard-select-view-container">
              <select onChange={(e) => setView(e.target.value)} value={view}>
                {views.map((viewOption) => (
                  <option key={viewOption} value={viewOption}>
                    {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}{" "}
                    View
                  </option>
                ))}
              </select>
            </div>
            <div className={`admin-dashboard-chart-content-container ${view}`}>
              <Chart view={view} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admindashboard;
