import React, { useContext } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import Pagination from "../Pagination";
import ReactSelect from "react-select";
import { AddOrUpdate } from "./AddOrUpdate";
import "../Employee/Emp.css";
import { Confirmation } from "./Confirmation";
import Form from "./Form";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { themeContext } from "../App";
export const Emp = () => {
  //States

  const [employeeList, setEmployeeList] = useState([]);
  const [employeeList1, setEmployeeList1] = useState([]);
  const [search, setSearch] = useState("");
  const { theme, setTheme } = useContext(themeContext);
  const [updateList,setUpdateList]=useState(false);
  const [sort, setSorting] = useState(false);
  const [editData, setEditData] = useState();
  const [status, setStatus] = useState("active");
  const [addOrUpdateModal, setAddOrUpdateModal] = useState(false);
  const [method, setMethod] = useState("submit");
  const [deleteItem, setDeleteItem] = useState(null);
  const [statusItem, setStatusItem] = useState(null);
  const [formStatus, setFormStatus] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(false);
  // paggination variable
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = employeeList.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigate = useNavigate();
  //Use Effects For Search
  useEffect(() => {
    getList(search);
  }, [updateList]);

  //User Effect For change background for AddOrUpdate popup
  useEffect(() => {
    const mainContent = document.querySelector(".main-div");
    if (addOrUpdateModal) {
      mainContent.classList.add("blur-background");
    } else {
      mainContent.classList.remove("blur-background");
    }

    return () => {
      mainContent.classList.remove("blur-background");
    };
  }, [addOrUpdateModal]);
 
  // functions

  // get All Employee Also it searches by ID
  const getList = (searchItem) => {
    // debugger;
    let url = `http://localhost:8080/employee`;
    if (searchItem && typeof (searchItem === "string")) {
      url += `/${searchItem}`;
    }

    fetch(url)
      .then((Response) => Response.json())
      .then((result) => {
        if (Array.isArray(result)) {
          if (sort) {
            console.log("result 1");

            // const rev=result.sort((a,b)=>b.id-a.id);
            setEmployeeList(result);
            setEmployeeList1(result);
            console.log("result 2");
          } else {
            let revList = result.reverse();

            setEmployeeList(revList);
            setEmployeeList1(revList);
            console.log(employeeList, "this is rev");

            console.log("result 4");
          }
        } else if (result && typeof result === "object") {
          setEmployeeList([result].reverse());
          setEmployeeList1([result]);
        } else {
          console.error("Unexpected API response format:", result);
          // setEmployeeList(searchItem);
        }
      })
      .catch((error) => console.error("API Error:", error));
  };
  // employeeList.reverse();
  // Handle Record by search
  const handleSearch = (search) => {
    setSearch(search);
    console.log("search item",search,employeeList1)
    let updatedList = employeeList1.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toString() === search ||
        e.designation.toLowerCase().includes(search.toLowerCase()) ||
        e.state.toLowerCase().includes(search.toLowerCase()) ||
        e.mobile.toString().includes(search.toString()) ||
        e.city.toLowerCase().includes(search.toLowerCase())
    );

    setEmployeeList(updatedList);
    getList(updatedList.length > 0 ? updatedList : search);
  };
  // Change theme
  const handleTheme = () => {
    document.body.className = theme ? "light-theme" : "dark-theme";
    theme ? setTheme(false) : setTheme(true);
  };
  // Sorting Function
  const handleSort = () => {
    const sortedList = [...employeeList].sort((a, b) =>
      sort ? b.id - a.id : a.id - b.id
    );
    setEmployeeList(sortedList);
    setSorting(!sort);
  };
  // Open modal for confirmation
  const handleStatus1 = (item) => {
    setMethod("status");
    setConfirmStatus(true);
    setStatusItem(item);
    setStatus(item.status);
  };
  // change Employee status After Confirmation
  const handleConfirmedStatus = () => {
    let Status = statusItem.status === "active" ? "deactive" : "active";
    if (statusItem.status === "active") {
      setStatus("deactive");
    } else {
      setStatus("active");
    }

    fetch("http://localhost:8080/employee/" + statusItem.id, {
      method: "PATCH",
      body: JSON.stringify({
        status: Status,
      }),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        // getEmployee();
        getList();
        // clear();
        // alert("Employee Updated");
      });
    // console.log("STATUS DATA",item)
  };
  // Function for Edit
  const handleEdit = (item) => {
    setEditData(item.id);
    setMethod("edit");
    setAddOrUpdateModal(true);
    console.log("Data in function", item);
  };
  // Gives small msg on over
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Change Theme
    </Tooltip>
  );
  // open AddOrUpdate Modal
  const handleAdd = () => {
    setMethod("submit");
    setAddOrUpdateModal(true);
  };
  // Func to open delete confirmation modal
  const handleDelete = (item) => {
    setDeleteItem(item);
    setMethod("delete");
    setConfirmStatus(true);
  };
  
  // Delete after Confirmation
  const handleDeleteConfirmed = () => {
    fetch("http://localhost:8080/employee/" + deleteItem.id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        getList();
        // Optionally, show a success message or notification here
      })
      .catch((error) => console.error("Delete Error:", error));
  };
  // Close modal of confirmation
  const handleClose = () => {
    setConfirmStatus(false);
  };
  // Open Registration form
  const handleForm = () => {
    navigate("/form");
  };
  // console.log("theme", theme);
  return (
    <>
      <div className="main-div">
        <h3 className="text-center m-5 searchbtn main-heading">
          <p style={{ margin: "0" }}>Employee Management</p>
        </h3>
        <div className="container fade-in ">
          <button
            type="button"
            class="btn btn-primary m-3 addBtn "
            onClick={() => handleAdd()}
          >
            Add new
          </button>

          <div class="row g-3 align-items-center">
            <div class="col-auto mb-3 ">
              <input
                type="text"
                value={search}
                id="search"
                className="form-control"
                aria-describedby="passwordHelpInline"
                placeholder="Search something..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="col-auto mb-3 formbtn">
              <button className="btn btn-success" onClick={handleForm}>
                Form
              </button>
            </div>
            <div class="col-auto mb-3 themeBtn">
              <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <span className="d-inline-block" tabindex="0">
                  {theme ? (
                    <CIcon
                      icon={icon.cilMoon}
                      onClick={handleTheme}
                      width={30}
                      height={30}
                    />
                  ) : (
                    <CIcon
                      icon={icon.cilSun}
                      onClick={handleTheme}
                      width={30}
                      height={30}
                    />
                  )}
                </span>
              </OverlayTrigger>
            </div>
          </div>
          <div className="table table-responsive shadow-lg p-3 mb-5 bg-body-tertiary rounded">
            <table
              className={`table table-hover ${theme ? "table-dark" : "table"}`}
            >
              <thead className="table table-dark">
                <tr>
                  <th scope="col">
                    Sr. No{" "}
                    {sort ? (
                      <CIcon
                        onClick={() => handleSort()}
                        icon={icon.cilArrowCircleBottom}
                        width={35}
                        height={35}
                      />
                    ) : (
                      <CIcon
                        onClick={() => handleSort()}
                        icon={icon.cilArrowCircleTop}
                        width={35}
                        height={35}
                      />
                    )}
                  </th>
                  <th scope="col">Employee Name</th>
                  <th scope="col">Mobile Number</th>
                  <th scope="col">Designation</th>
                  <th scope="col">State</th>
                  <th scope="col">City</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td onClick={() => setSorting(true)}>{++index}</td>
                        <td>
                          <strong>{item.name}</strong>
                        </td>
                        <td>
                          <strong>{item.mobile}</strong>
                        </td>
                        <td>
                          <strong>{item.designation}</strong>
                        </td>
                        <td>
                          <strong>{item.state}</strong>
                        </td>
                        <td>
                          <strong>{item.city}</strong>
                        </td>
                        <td>
                          <div class="form-check form-switch">
                            <label>
                              <strong>{item.status}</strong>
                            </label>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckDefault"
                              value={item.status}
                              onChange={() => handleStatus1(item)}
                              checked={item.status === "active"}
                            />
                          </div>
                        </td>
                        <td>
                          {/* <button
                            type="button"
                            class="btn btn-success mx-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button> */}
                          <span
                            className="btn btn-success"
                            onClick={() => handleEdit(item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              fill="currentColor"
                              class="bi bi-pencil-square"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                              <path
                                fill-rule="evenodd"
                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                              />
                            </svg>
                          </span>

                          <span className="btn btn-danger mx-1" onClick={() => handleDelete(item)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                              fill="currentColor"
                              class="bi bi-trash3-fill "
                              viewBox="0 0 16 16"
                            >
                              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                            </svg>
                          </span>
                          {/* <button
                            className="btn btn-danger"
                          >
                            Delete
                          </button> */}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={employeeList.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
      {addOrUpdateModal && (
        <AddOrUpdate
          addOrUpdateModal={addOrUpdateModal}
          setAddOrUpdateModal={setAddOrUpdateModal}
          method={method}
          setMethod={setMethod}
          editData={editData}
          setUpdateList={setUpdateList}
          updateList={updateList}
        />
      )}
      {confirmStatus && method == "delete" ? (
        <Confirmation
          deleteItem={handleDeleteConfirmed}
          confirmationStatus={confirmStatus}
          onClose={handleClose}
          method={method}
        />
      ) : (
        <Confirmation
          statusItem={handleConfirmedStatus}
          confirmationStatus={confirmStatus}
          onClose={handleClose}
          method={method}
          status={status}
        />
      )}
      {/* {formStatus && <Form />} */}
    </>
  );
};
