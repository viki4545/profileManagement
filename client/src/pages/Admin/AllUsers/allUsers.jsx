import React, { useEffect, useState } from "react";
import "./allUsers.css";
import Adminsidebar from "../../../components/Adminsidebar/adminSidebar";
import Adminnavbar from "../../../components/Adminnavbar/adminNavbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const AllUsers = ({ isChecked, handleChange }) => {
  const [isSidebar, setIsSidebar] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPageRecord = 5;
  const lastIndex = currentPage * perPageRecord;
  const firstIndex = lastIndex - perPageRecord;
  const records = usersData.slice(firstIndex, lastIndex);
  const nPages = Math.ceil(usersData.length / perPageRecord);
  const numbers = [...Array(nPages + 1).keys()].slice(1);

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setUsersData(data);
    };
    fetchDataFromFirestore();
  }, []);

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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Gender</th>
                <th>details</th>
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
                                  More details
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
                <th>Name</th>
                <th>Email</th>
                <th>details</th>
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
                                  More details
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
