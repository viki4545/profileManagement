import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "../../../components/Chart/chart";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import "./admindashboard.css";
import { getApiDataThunk } from "../../../redux/features/adminSlice/adminSlice";

const Admindashboard = ({ isChecked, handleChange }) => {
  const dispatch = useDispatch();

  const { apiData, loading, error } = useSelector(
    (state) => state.rootReducer.adminInfo
  );
  const [isSidebar, setIsSidebar] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [view, setView] = useState("line");
  const views = ["line", "bar", "pie"];

  useEffect(() => {
    dispatch(getApiDataThunk());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(Array.isArray(apiData.data) ? apiData.data : []);
  }, [apiData]);

  console.log(apiData.data);

  const filterData = () => {
    const filtered = apiData.data.filter((item) => {
      const date = new Date(item.date);
      return (
        (!startDate || date >= new Date(startDate)) &&
        (!endDate || date <= new Date(endDate))
      );
    });
    setFilteredData(filtered);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error}</p>;

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
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content-container">
          <div className="admin-dashboard-inner-content-container">
            <h1>Data Visualization Dashboard</h1>
            <div className="admin-dashboard-filter-container">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button onClick={filterData}>Filter</button>
            </div>
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
            <Chart data={filteredData} view={view} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admindashboard;
