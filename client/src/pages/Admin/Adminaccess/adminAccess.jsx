import React, { useEffect, useState } from "react";
import "./adminAccess.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const Adminaccess = ({ isChecked, handleChange }) => {
  const [isSidebar, setIsSidebar] = useState(false);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const querySnapshot = await getDocs(collection(db, "admin"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setAdminData(data);
    };
    fetchDataFromFirestore();
  }, []);

  console.log(adminData);

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
      <div className="admin-access-main-container">
        <div className="admin-access-content-container">
          <div className="admin-access-inner-content-container">
            <div className="admin-access-label-container">
              <label htmlFor="phone">Id</label>
              <label htmlFor="code">email</label>
            </div>
            {adminData.map((data, idx) => (
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
              <a href="/admin/signup">Add admin +</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminaccess;
