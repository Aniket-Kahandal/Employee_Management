/*global $ */
import React, { useEffect, useState } from 'react'
export const City = ({ state,getCityByState, handleCityModal,cityModal,setCityModal,cityList}) => {
  // States
  
  const [cityInModal, setCityInModal] = useState("");
  const [cityInModalError,setCityInModalError]=useState("");

  // Add new City
  const handleCity = () => {
    debugger
    let isValid = false;
    
    if (!cityInModal.trim()) {
      setCityInModalError("City name is mandatory");
      isValid = true;
    }
    
    if (state === 0 || state === undefined) {
      setCityInModalError("State is mandatory");
      isValid = true;
    }
    let existingCity = cityList.filter(
      (e) => e.name.toLowerCase() === cityInModal.toLowerCase()
    );
    
    if (!isValid && existingCity.length === 0) {

      fetch("http://localhost:8082/city", {
        method: "POST",
        body: JSON.stringify({
          id: ""+(cityList.length + 1),
          name: cityInModal,
          // state: stateName,
          stateid: parseInt(state),
        }),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          getCityByState(state);
          
          // Set the new city as selected
          handleCityModal(result.id);
          $("#" + "exampleModal1").modal("hide");
          clearCityModal();
          // alert("New city added successfully");
        })
        .catch((error) => {
          console.error("Error adding city:", error);
        });
    } else if (existingCity.length > 0) {
      setCityInModalError("City already exists");
    }
  };

  // Clear All data
  const clearCityModal = () => {
    setCityInModal("");
    setCityInModalError("");
    setCityModal(false)
  };
  return (
   <>
    <div
          class={`modal fade ${cityModal ? "show" : ""}`}
          id="exampleModal1"
          tabindex="-1"
          aria-labelledby="exampleModalLabel1"
          aria-hidden={!cityModal}
          style={{ display: cityModal ? "block" : "none" }}
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" >
                <h1 class="modal-title fs-5 text-center darkFont"  style={{marginLeft:"38%", fontFamily:"fantasy"}} id="exampleModalLabel1">
                  Add new City
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => clearCityModal()}
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-control mb-3 text-center">
                <label for="cityinput" className="form-label">
                    <strong>Enter City <span className="validationmsg"> *</span></strong>
                  </label>
                  <input
                    type="text"
                    class="form-control text-center"
                    id="cityinput"
                    placeholder="Enter city name"
                    value={cityInModal}
                    onChange={(e) => setCityInModal(e.target.value)}
                  />
                 
                  <span className="validationmsg">
                    {cityInModalError &&
                    (cityInModal === null ||
                      cityInModal === undefined ||
                      cityInModal === "" ||
                      cityInModal)
                      ? cityInModalError
                      : ""}
                  </span>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => clearCityModal()}
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleCity()}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
   </>
  )
}
