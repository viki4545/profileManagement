import React, { useEffect, useState } from "react";
import "./allUsers.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  getAllUsersThunk,
} from "../../../redux/features/adminSlice/adminSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllUsers = ({ isChecked, handleChange }) => {
  const { t } = useTranslation();

  let dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebar, setIsSidebar] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPageRecord = 5;
  const lastIndex = currentPage * perPageRecord;
  const firstIndex = lastIndex - perPageRecord;
  const records = usersData.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(usersData.length / perPageRecord);
  const numbers = [...Array(nPages + 1).keys()].slice(1);

  const error = useSelector((state) => state.rootReducer.adminInfo.error);
  const loading = useSelector((state) => state.rootReducer.adminInfo.loading);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/admin/login");
    } else {
      dispatch(getAllUsersThunk()).then((data) => {
        if (data.payload) {
          setUsersData(data.payload);
          toast.success("All Users data fetched successfully");
        } else {
          toast.error("Failed to fetch user data");
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

  const handleOnDragEnd = (result) => {
    const items = Array.from(usersData);
    const [reordereditems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordereditems);
    setUsersData(items);
  };

  const prevClick = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentClick = (id) => {
    setCurrentPage(id);
  };

  const nextClick = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
      <div className="admin-users-data-main-container">
        <div className="admin-user-data-card-container">
          {/* For Desktop */}
          <div className="admin-user-data-content-container">
            <table>
              <thead>
                <th>{t("Name")}</th>
                <th>{t("Email")}</th>
                <th>{t("Phone")}</th>
                <th>{t("Gender")}</th>
                <th></th>
              </thead>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {records?.map((data, idx) => (
                        <Draggable
                          key={idx.toString()}
                          draggableId={idx.toString()}
                          index={idx}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td>{data.firstName}</td>
                              <td>{data.email}</td>
                              <td>{data.phone}</td>
                              <td>{data.gender}</td>
                              <td>
                                <a href={`/admin/users/${data.uid}`}>
                                  {t("Moredetails")}
                                </a>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
          {/*for mobile  */}
          <div className="admin-user-mob-data-content-container">
            <table>
              <thead>
                <th>{t("Name")}</th>
                <th>{t("Email")}</th>
                <th></th>
              </thead>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {records?.map((data, idx) => (
                        <Draggable
                          key={idx.toString()}
                          draggableId={idx.toString()}
                          index={idx}
                        >
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <td>{data.firstName}</td>
                              <td>{data.email}</td>
                              <td>
                                <a href={`/admin/users/${data.uid}`}>
                                  {t("Moredetails")}
                                </a>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
          <div className="admin-user-data-pagination-container">
            <div
              className="admin-user-data-left-btn-container"
              onClick={prevClick}
            >
              <IoMdArrowDropleft />
            </div>
            <div className="admin-user-data-pagination-data-container">
              {numbers?.map((data, idx) => (
                <p
                  className={currentPage === data ? "active" : ""}
                  key={idx}
                  onClick={() => currentClick(data)}
                >
                  {data}
                </p>
              ))}
            </div>
            <div
              className="admin-user-data-right-btn-container"
              onClick={nextClick}
            >
              <IoMdArrowDropright />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
