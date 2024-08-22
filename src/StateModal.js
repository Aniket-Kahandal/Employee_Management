/* global $ */

import React, { useEffect } from 'react'
import { useState } from 'react';

export const StateModal = ({modalStatus}) => {
    const [stateModal, setStateModal] = useState("");
    const [stateModalError, setStateModalError] = useState("");
    const [stateList, setStateList] = useState([]);
    const [EmployeeList, setEmployeeList] = useState([]);

    let statemodal=modalStatus;

    useEffect(()=>{
        getState();
        getList();
    },[])
    const getState = () => {
        fetch("http://localhost:8081/state")
          .then((response) => response.json())
          .then((result) => {
            setStateList(result);
          });
      };
    const clearStateModal = () => {
        setStateModal("");
        setStateModalError("");
      };
    const handleState = () => {
        // debugger;
        let isvalid = false;
        if (!stateModal.trim() || stateModal==undefined || stateModal=="") {
          setStateModalError("Mandatory");
          isvalid = true;
        }
        let stateVal;
        let findState = stateList.filter((e) => e.name == stateModal);
         stateList.filter((e)=>e.id==stateModal).map((item)=>{stateVal=item.name})
        if (!isvalid && findState.length === 0) {
          fetch("http://localhost:8081/state", {
            method: "POST",
            body: JSON.stringify({
              id: "" + (stateList.length + 1),
              name: stateModal,
            }),
            headers: { "Content-type": "application/json" },
          })
            .then((response) => response.json())
            .then((result) => {
              getState();
            //   getList();
            statemodal=false;
             clearStateModal();
            //   setModalStatus(false);
              alert("new state added");
            //   setState(stateList.length + 1);
              $("#" + "exampleModal").modal("hide");
            });
        } else if (findState.length > 0) {
          // alert("State already exist");
        //   setStateError("State already exist");
          setStateModalError("Already exist");
        }
      };
      const getList = () => {
        // debugger;
        let url = "http://localhost:8080/employee";
       
        fetch(url)
          .then((Response) => Response.json())
          .then((result) => {
            setEmployeeList(result);
           
          })
          .catch((error) => console.error("API Error:", error));
      };
  return (
    <>
     <div
          className={`modal fade ${modalStatus ? "show" : ""}`}
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: modalStatus ? "block" : "none" }} // Added to make modal visible in example
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header ">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add new State
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => clearStateModal()}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="stateinput1"
                    placeholder="Name as per gov document"
                    value={stateModal}
                    onChange={(e) => setStateModal(e.target.value)}
                  />
                  <label htmlFor="stateinput1">
                    <strong>Enter State</strong>
                  </label>
                  <span className="validationmsg">
                    {stateModalError &&
                    (stateModal === null ||
                      stateModal === "" ||
                      stateModal === undefined ||
                      stateModalError)
                      ? stateModalError
                      : ""}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => clearStateModal()}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleState()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
