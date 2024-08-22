/*global $ */

import React, { useEffect, useState } from "react";
export const State = ({
  setModalStatus,
  stateList,
  handleStateModal,
  modalStatus,
  getState,
}) => {
  // States
  const [stateModal, setStateModal] = useState("");
  const [stateModalError, setStateModalError] = useState("");

  // Add new State
  const handleState = () => {
    debugger;
    let isvalid = false;
    if (!stateModal.trim()) {
      setStateModalError("Mandatory");
      isvalid = true;
    }
    let stateVal;
    let findState = stateList
      .filter((e) => e.name.toLowerCase() == stateModal.toLowerCase())
      .map((item) => {
        stateVal = item.name;
      });
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

          handleStateModal(result.id);
          clearStateModal();

          // alert("new state added");
          $("#" + "exampleModal").modal("hide");
        });
    } else if (findState.length > 0) {
      // alert("State already exist");
      // setStateError("State already exist");
      setStateModalError("Already exist");
    }
  };
  // Clear state and Errors
  const clearStateModal = () => {
    setStateModal("");
    setStateModalError("");
    setModalStatus(false);
  };

  return (
    <>
      <div
        className={`modal fade ${modalStatus ? "show" : ""}`}
        id="exampleModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!modalStatus}
        style={{ display: modalStatus ? "block" : "none" }} // Control display style
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h1
                className="modal-title fs-5 darkFont "
                style={{ marginLeft: "38%", fontFamily: "fantasy" }}
                id="exampleModalLabel"
              >
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
              <div className="form-control mb-3 text-center">
                <label htmlFor="stateinput1" className="form-label ">
                  <strong>
                    Enter State <span className="validationmsg">*</span>
                  </strong>
                </label>
                <input
                  type="text"
                  className="form-control text-center"
                  id="stateinput1"
                  placeholder="Add new State"
                  value={stateModal}
                  onChange={(e) => setStateModal(e.target.value)}
                />

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
              <button className="btn btn-primary" onClick={() => handleState()}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
