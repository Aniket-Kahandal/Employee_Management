import React from "react";

export const Confirmation = ({confirmationStatus, deleteItem,onClose, method, statusItem, status}) => {
  return (
    <>
      <div
        className={`modal fade ${confirmationStatus ? "show" : ""}`}
        id="confirmation"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="confirmation"
        aria-hidden={!confirmationStatus}
        style={{ display: confirmationStatus ? "block" : "none" }} // Control display style
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              {method == "delete" ? (
                <h1
                  className="modal-title fs-5 darkFont"
                  style={{ marginLeft: "38%", fontFamily: "fantasy" }}
                  id="exampleModalLabel"
                >
                  Confirm Delete
                </h1>
              ) : (
                <h1
                  className="modal-title fs-5 darkFont"
                  style={{ marginLeft: "38%", fontFamily: "fantasy" }}
                  id="exampleModalLabel"
                >
                  Change Status
                </h1>
              )}

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-center">
              {method == "delete" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  fill="currentColor"
                  className="bi bi-trash3 m-3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  fill="currentColor"
                  class="bi bi-exclamation-triangle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>
              )}

              <p>Are you sure ?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={onClose}
              >
                Close
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  {
                    method == "delete" ? deleteItem() : statusItem();
                  }
                  onClose();
                }}
              >
                Yes ! I confirmed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
