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
      <div className="admin-users-data-main-container">
        <div className="admin-user-data-card-container">
          <div className="admin-user-data-content-container">
            <table>
              <thead>
                <th>SrNo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>details</th>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Vicky</td>
                  <td>viki@gmail.com</td>
                  <td>9987288679</td>
                  <td>Male</td>
                  <td>
                    <a href="/profile/">More details</a>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Vicky</td>
                  <td>viki@gmail.com</td>
                  <td>9987288679</td>
                  <td>Male</td>
                  <td>
                    <a href="">More details</a>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Vicky</td>
                  <td>viki@gmail.com</td>
                  <td>9987288679</td>
                  <td>Male</td>
                  <td>
                    <a href="">More details</a>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Vicky</td>
                  <td>viki@gmail.com</td>
                  <td>9987288679</td>
                  <td>Male</td>
                  <td>
                    <a href="">More details</a>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Vicky</td>
                  <td>viki@gmail.com</td>
                  <td>9987288679</td>
                  <td>Male</td>
                  <td>
                    <a href="">More details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
