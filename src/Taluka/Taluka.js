/*global $ */
import React, { useEffect,useState } from 'react'
export const Taluka = ({city,cityList,handleTalukaModal,talukaModal,setTalukaModal,getTalukaByCities}) => {
  // States
  const [talukaList, setTalukaList] = useState([]);
  const [talukaInModal, setTalukaInModal] = useState("");
  const [talukaInModalError, setTalukaInModalError] = useState("");
  
  // USEEFFECT to GET talukaList
  useEffect(()=>{
    getTaluka1();
  },[])
  // GET talukaList
  const getTaluka1 = () => {
    fetch("http://localhost:8083/taluka")
      .then((response) => response.json())
      .then((result) => {
        setTalukaList(result);
        
      });
    
  };
  // Add new Taluka
  const handleTaluka = () => {
    // ;
    let isvalid = false;
    if (!talukaInModal.trim()) {
      setTalukaInModalError(" Mandatory");
      isvalid = true;
    }
    if (city == 0 || city === undefined) {
      setTalukaInModalError(" Mandatory");
      isvalid = true;
    }
    let cityval;
    let findTaluka = talukaList.filter((e) => e.name.toLowerCase() === talukaInModal.toLowerCase());

    cityList.filter((e) => e.id == city).map((item) => (cityval = item.name));
    if (!isvalid && findTaluka.length === 0) {
      fetch("http://localhost:8083/taluka", {
        method: "POST",
        body: JSON.stringify({
          id: " " + (talukaList.length + 1),
          name: talukaInModal,
          City: cityval,
          cityid: parseInt(city),
        }),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          getTalukaByCities (city);
          setTalukaModal(false);
          handleTalukaModal(result.id)

          // alert("New taluka Added");
          $("#" + "exampleModal2").modal("hide");

          clearTalukaModal();
        });
    } else if (findTaluka.length > 0) {
      // alert("Taluka already exist");
      setTalukaInModalError("Taluka already Exist");
    }
  };
  // Clear all states
  const clearTalukaModal = () => {
    setTalukaInModal("");
    setTalukaInModalError("");
    setTalukaModal(false);

  };

  return (
    <>
      <div
          class={`modal fade ${talukaModal ? "show" : ""}`}
          id="exampleModal2"
          tabindex="-1"
          aria-labelledby="exampleModalLabel2"
          aria-hidden={!talukaModal}
          style={{ display: talukaModal ? "block" : "none" }}
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header" >
                <h1 class="modal-title fs-5 darkFont text-center" style={{marginLeft:"38%", fontFamily:"fantasy"}} id="exampleModalLabel2">
                  ADD NEW TALUKA
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => clearTalukaModal()}
                ></button>
              </div>
              <div class="modal-body">
                <div class="form-control mb-3 text-center" >
                <label for="talukainput" className="form-label"> 
                    <strong>Add Taluka <span className="validationmsg">*</span></strong>
                  </label>
                  <input
                    type="text"
                    class="form-control text-center"
                    id="talukaipnput"
                    placeholder="Enter Taluka Name"
                    value={talukaInModal}
                    onChange={(e) => setTalukaInModal(e.target.value)}
                  />
                  
                  <span className="validationmsg">
                    {talukaInModalError &&
                      (talukaInModal === null ||
                      talukaInModal === undefined ||
                      talukaInModal === "" ||
                      talukaInModal
                        ? talukaInModalError
                        : "")}
                  </span>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => clearTalukaModal()}
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleTaluka()}
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
