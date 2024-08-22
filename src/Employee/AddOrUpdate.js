/*global $ */
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { State } from "../State/State";
import { City } from "../City/City";
import { Taluka } from "../Taluka/Taluka";


export const AddOrUpdate = ({
  addOrUpdateModal,
  setAddOrUpdateModal,
  method,
  editData,
  setUpdateList,
  updateList,
}) => {
  //Form states in object
  const [employeeObj, setEmployeeObj] = useState({
    id: "",
    name: "",
    mobile: "",
    designation: "",
    salary: null,
    lastComp: "",
    gender: "",
    address: "",
    state: 0,
    city: 0,
    taluka: 0,
    skill: [],
    workingArea: [],
  });
  // other states
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [talukaList, setTalukaList] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [cityModal, setCityModal] = useState(false);
  const [talukaModal, setTalukaModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  let [maxId, setMaxID] = useState();

  //   Validation Error States
  const [validationError, setValidationError] = useState({
    nameError: "",
    mobileError: "",
    designationError: "",
    salaryError: "",
    workingAreaError: "",
    addressError: "",
    stateError: "",
    skillError: "",
    genderError: "",
    cityError: "",
    talukaError: "",
  });

  // UseEffect for GET state
  useEffect(() => {
    getState();
  }, []);

  // USEEFFECT for calling Edit function if method is EDIT
  useEffect(() => {
    if (method === "edit" && editData) {
      handleEdit(editData);
    }
  }, []);
  //USEEFFECT for GET City data accroding to state selected
  useEffect(() => {
    getCityByState(employeeObj.state);
  }, [employeeObj.state]);

  //USEEFFECT for GET taluka When city changes
  useEffect(() => {
    if(employeeObj.city)
    {
    getTalukaByCities(employeeObj.city);
    }
  }, [employeeObj.city]);

  // USEEFFECT for trigger API for GETmaxId
  useEffect(() => {
    getMaxId();
  }, []);

  // GET MaxID
  const getMaxId = () => {
    fetch("http://localhost:8080/employee")
      .then((response) => response.json())
      .then((result) => {
        const maxNumber = Math.max(...result.map((id) => id.id));
        setMaxID(maxNumber)
        setEmployeeObj((prevobj)=>({...prevobj,id:""+maxNumber+1}))
      });
  };

  // ADD OR UPDATE NEW DETAILS
  const handleAddUpdate = (item) => {
    debugger;
    item.preventDefault();
    let isvalid = validateForm();
    if (!isvalid) {
      let stateval, cityval, talukaval;
      stateList
        .filter((e) => e.id == employeeObj.state)
        .map((item) => {
          stateval = item.name;
        });
      cityList
        .filter((e) => e.id == employeeObj.city)
        .map((item) => {
          cityval = item.name;
        });
      talukaList
        .filter((e) => e.id == employeeObj.taluka)
        .map((item) => {
          talukaval = item.name;
        });
      getMaxId();
      if (isvalid === false && method === "submit") {
        fetch("http://localhost:8080/employee", {
          method: "POST",
          body: JSON.stringify({
            ...employeeObj,
            
            id: "" + (maxId + 1),
            state: stateval,
            city: cityval,
            taluka: talukaval,
            status: "active",
            stateid: employeeObj.state,
            cityid: employeeObj.city,
            talukaid: employeeObj.taluka,
           
          }),
          headers: { "Content-type": "application/json" },
        })
          .then((response) => response.json())
          .then((result) => {
            setUpdateList(!updateList);
            clear();
            // alert("Employee Added");
            $("#" + "staticBackdrop").modal("hide");
          });
      } else if (isvalid === false && method === "edit") {
        //
        fetch("http://localhost:8080/employee/" + editData, {
          method: "PATCH",
          body: JSON.stringify({
            ...employeeObj,
            state: stateval,
            city: cityval,
            taluka: talukaval,
            stateid: employeeObj.state,
            cityid: employeeObj.city,
            talukaid: employeeObj.taluka,
           
          }),
          headers: { "Content-type": "application/json" },
        })
          .then((response) => response.json())
          .then((result) => {
            alert("Employee Updated");
            setUpdateList(!updateList);
            clear();
            $("#" + "staticBackdrop").modal("hide");
          });
      }
    }
  };
  // GET States
  const getState = () => {
    fetch("http://localhost:8081/state")
      .then((response) => response.json())
      .then((result) => {
        setStateList(result);
      });
  };

  const getCityByState = (state) => {
    debugger;
    fetch(`http://localhost:8082/city?stateid=${state}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // console.log("FilterData", result);
        setCityList(result);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // GET Taluka
  const getTalukaByCities = (city) => {
    fetch(`http://localhost:8083/taluka?cityid=${city}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // console.log("FilterData", result);
        setTalukaList(result);
        let workingArea = result
          .filter((Taluka) =>
            employeeObj.workingArea.includes(Number(Taluka.id))
          )
          .map((Taluka) => ({ label: Taluka.name, value: Taluka.id }));
        // console.log("options", workingArea);
        console.log(employeeObj.workingArea, "workingArea3");

        setTimeout(function(){
          // alert(city + " : " + JSON.stringify(workingArea))
          setSelectedOption(workingArea);
        },500);
        
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  //Manage states after City changes
  const handleSelectCity = (value) => {
    setSelectedOption([]);
    setEmployeeObj((prevObj) => ({
      ...prevObj,
      taluka: 0,
      city: value,
    }));

  };
  // Add Skills
  const handleSkills = (skill) => {
    setEmployeeObj((prev) => {
      const newSkills = prev.skill.includes(skill)
        ? prev.skill.filter((s) => s !== skill) // Remove skill if already selected
        : [...prev.skill, skill]; // Add skill if not selected

      return { ...prev, skill: newSkills };
    });
  };

  // Manage States for EDIT Data
  const handleEdit = (employeeId) => {
    fetch("http://localhost:8080/employee/" + employeeId)
      .then((response) => response.json())
      .then((result) => {
        setEmployeeObj({
          id: result.id,
          name: result.name,
          mobile: result.mobile,
          designation: result.designation,
          salary: result.salary,
          lastComp: result.lastComp,
          gender: result.gender,
          address: result.address,
          state: result.stateid,
          city: result.cityid,
          taluka: result.talukaid,
          skill: result.skill,
          workingArea: result.workingArea,
        });
        console.log("id", result.id);

        // Filter and map options based on workingArea
        // getTalukaByCities(result.cityid);
      });
  };

  // Clear states
  const clear = () => {
    setEmployeeObj({
      id: "",
      name: "",
      mobile: "",
      designation: "",
      salary: null,
      lastComp: "",
      gender: "",
      address: "",
      state: 0,
      city: 0,
      taluka: 0,
      skill: [],
      workingArea: [],
    });
    // setMethod("submit");
    setSelectedOption([]);
    setAddOrUpdateModal(false);
  };

  // Manage Multiple Selectors of working location
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setEmployeeObj((prevObj) => ({
      ...prevObj,
      workingArea: selectedOption.map((item) => {
        return parseInt(item.value);
      }),
    }));
  };
  //Validation for All fields
  const validateForm = () => {
    debugger;
    let isvalid = false;
    if (
      employeeObj.name === undefined ||
      !employeeObj.name.trim() ||
      employeeObj.name === "" ||
      employeeObj.name === null
    ) {
      setValidationError((prevObj) => ({ ...prevObj, nameError: "Required" }));
      isvalid = true;
    }

    if (
      employeeObj.designation === undefined ||
      !employeeObj.designation.trim() ||
      employeeObj.designation === null ||
      employeeObj.designation === ""
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        designationError: "Required",
      }));

      isvalid = true;
    }
    if (
      employeeObj.salary === null ||
      employeeObj.salary === undefined ||
      employeeObj.salary === 0 ||
      employeeObj.salary === ""
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        salaryError: "Required",
      }));

      isvalid = true;
    }
    if (employeeObj.skill === undefined || employeeObj.skill.length == 0) {
      setValidationError((prevObj) => ({
        ...prevObj,
        skillError: "select atleast one skill",
      }));

      isvalid = true;
    }
    if (
      employeeObj.gender === null ||
      employeeObj.gender === undefined ||
      employeeObj.gender === ""
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        genderError: "Required",
      }));

      isvalid = true;
    }
    if (
      employeeObj.address === null ||
      employeeObj.address === undefined ||
      employeeObj.address === ""
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        addressError: "Required",
      }));

      isvalid = true;
    }
    if (employeeObj.state === undefined || employeeObj.state == 0) {
      setValidationError((prevObj) => ({ ...prevObj, stateError: "Required" }));

      isvalid = true;
    }
    if (employeeObj.city === undefined || employeeObj.city == 0) {
      setValidationError((prevObj) => ({ ...prevObj, cityError: "Required" }));

      isvalid = true;
    }
    if (employeeObj.taluka === undefined || employeeObj.taluka == 0) {
      setValidationError((prevObj) => ({
        ...prevObj,
        talukaError: "Required",
      }));

      isvalid = true;
    }
    if (
      employeeObj.mobile === undefined ||
      employeeObj.mobile.length < 10 ||
      employeeObj.mobile.length > 10 ||
      employeeObj.mobile.toString().includes(CharacterData)
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        mobileError: "Number not valid",
      }));

      isvalid = true;
    }
    if (
      employeeObj.mobile == null ||
      employeeObj.mobile === undefined ||
      employeeObj.mobile.length === 0
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        mobileError: "required",
      }));

      isvalid = true;
    }

    if (
      employeeObj.workingArea === undefined ||
      selectedOption === undefined ||
      employeeObj.workingArea.length === 0 ||
      selectedOption.length == 0
    ) {
      setValidationError((prevObj) => ({
        ...prevObj,
        workingAreaError: "required",
      }));

      isvalid = true;
    }
    return isvalid;
  };
  // to Open state modal
  const handleState = (item) => {
    setModalStatus(true);
  };
  // to open City Modal
  const handleCity = (item) => {
    let isValid =
      employeeObj.state !== null &&
      employeeObj.state !== undefined &&
      employeeObj.state !== 0 &&
      employeeObj.state !== "";
    if (isValid) {
      setCityModal(true);
    } else {
      setValidationError((prevErr) => ({
        ...prevErr,
        stateError: "Select state",
      }));
    }
    // console.log("State", employeeObj.state, "citymodal", cityModal);
  };
  // update  new added state
  const handleStateModal = (id) => {
    setEmployeeObj((prev)=>({...prev,state:id,city:0,taluka:0}))
  };
  // update new added city
  const handleCityModal = (id) => {
    // debugger
    setEmployeeObj((prev)=>({...prev,city:id,taluka:0}))
    
    setSelectedOption([]);
    console.log("id from citymodal", id)
  };
  // update new added taluka
  const handleTalukaModal = (id) => {
    setEmployeeObj((prev)=>({...prev,taluka:id}))
  };
  // To Open Taluka Modal
  const handleTaluka = (item) => {
    let isValid =
      employeeObj.city !== null &&
      employeeObj.city !== undefined &&
      employeeObj.city !== 0 &&
      employeeObj.city !== "";
    if (isValid) {
      setTalukaModal(true);
    } else {
      setValidationError((prevErr) => ({
        ...prevErr,
        cityError: "select city",
      }));
    }
  };
  // console.log("Data for edit", editData, "Method", method);
  // console.log(selectedOption, "selectedoptions");
  return (
    <>
      <div
        className={`modal fade ${addOrUpdateModal ? "show" : ""}`}
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden={!addOrUpdateModal}
        style={{ display: addOrUpdateModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{
                flexDirection: "column-reverse",
                fontFamily: "revert",
                fontWeight: "bolder",
              }}
            >
              {method === "submit" ? (
                <h1
                  className="modal-title fs-5 darkFont"
                  style={{ flexDirection: "column" }}
                  id="staticBackdropLabel"
                >
                  Add New Employee
                </h1>
              ) : (
                <h1
                  className="modal-title fs-5 darkFont"
                  id="staticBackdropLabel"
                >
                  Update Detail
                </h1>
              )}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => clear()}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddUpdate}>
                <div className="container d-flex">
                  <div className="w-50 p-1">
                    <div className="form-control mb-3">
                      <label htmlFor="floatingInput" className="form-label">
                        <strong>
                          Enter full name{" "}
                          <span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Name as per gov document"
                        value={employeeObj.name}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                      <span className="validationmsg">
                        {validationError.nameError &&
                        (employeeObj.name === null ||
                          employeeObj.name === undefined ||
                          employeeObj.name === "")
                          ? validationError.nameError
                          : ""}
                      </span>
                    </div>

                    <div className="form-control mb-3">
                      <label htmlFor="floatingInput" className="form-label">
                        <strong>
                          Mobile number
                          <span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Enter 10 Digit Number"
                        value={
                          employeeObj.mobile === null ||
                          employeeObj.mobile === 0 ||
                          employeeObj.mobile === undefined
                            ? ""
                            : employeeObj.mobile
                        }
                        maxLength={10}
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setEmployeeObj((prev) => ({
                            ...prev,
                            mobile: value,
                          }));
                        }}
                      />
                      <span className="validationmsg">
                        {validationError.mobileError &&
                        (employeeObj.mobile === null ||
                          employeeObj.mobile == undefined ||
                          employeeObj.mobile.length != 10)
                          ? validationError.mobileError
                          : ""}
                      </span>
                    </div>

                    <div className="form-control mb-3">
                      <label className="form-label">
                        <strong>
                          Select designation{" "}
                          <span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <select
                        className="form-control"
                        value={employeeObj.designation}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            designation: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>
                          <strong>Select Designation...</strong>
                        </option>
                        <option>HR</option>
                        <option>UI/UX</option>
                        <option>REACT JS</option>
                      </select>
                      <span className="validationmsg">
                        {validationError.designationError &&
                        (employeeObj.designation === null ||
                          employeeObj.designation === undefined ||
                          employeeObj.designation == "")
                          ? validationError.designationError
                          : ""}
                      </span>
                    </div>

                    <div className="form-control mb-3">
                      <label htmlFor="salaryinput" className="form-label">
                        <strong>
                          Salary<span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="salaryinput"
                        placeholder="Enter salary"
                        value={employeeObj.salary || ""}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            salary: e.target.value,
                          }))
                        }
                      />
                      <span className="validationmsg">
                        {validationError.salaryError &&
                        (employeeObj.salary === null ||
                          employeeObj.salary === undefined ||
                          employeeObj.salary === 0)
                          ? validationError.salaryError
                          : ""}
                      </span>
                    </div>

                    <div className="form-control mb-3">
                      <label htmlFor="floatingInput" className="form-label">
                        <strong>Last Company name</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Enter Last comp name"
                        value={employeeObj.lastComp}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            lastComp: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="form-control form-label">
                      <strong>
                        Select skills<span className="validationmsg">*</span>{" "}
                      </strong>
                      <br></br>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input mx-2"
                          type="checkbox"
                          id="inlineCheckbox1"
                          value="Reactjs"
                          onChange={(e) => handleSkills(e.target.value)}
                          checked={
                            employeeObj.skill &&
                            employeeObj.skill.includes("Reactjs")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox1"
                        >
                          React js
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox2"
                          value="DotNet"
                          onChange={(e) => handleSkills(e.target.value)}
                          checked={
                            employeeObj.skill &&
                            employeeObj.skill.includes("DotNet")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox2"
                        >
                          Dot net
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="UI"
                          onChange={(e) => handleSkills(e.target.value)}
                          checked={
                            employeeObj.skill &&
                            employeeObj.skill.includes("UI")
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox3"
                        >
                          Html ,css
                        </label>
                      </div>
                      <span className="validationmsg">
                        {validationError.skillError &&
                        (employeeObj.skill === undefined ||
                          employeeObj.skill === null ||
                          employeeObj.skill.length === 0)
                          ? validationError.skillError
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="w-50">
                    <div className="form-control">
                      <label htmlFor="floatingTextarea2" className="form-label">
                        <strong>
                          Enter Full Address
                          <span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: "100px" }}
                        placeholder="flat no./ locality"
                        id="floatingTextarea2"
                        value={employeeObj.address}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      ></textarea>
                      <span className="validationmsg">
                        {validationError.addressError &&
                        (employeeObj.address === undefined ||
                          employeeObj.address === null ||
                          employeeObj.address === "")
                          ? validationError.addressError
                          : ""}
                      </span>
                    </div>
                    <div className="form-control mt-3">
                      <strong>
                        Select Gender<span className="validationmsg">*</span>
                      </strong>
                      <br></br>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="male"
                          value="male"
                          checked={employeeObj.gender === "Male"}
                          onChange={(e) =>
                            setEmployeeObj((prev) => ({
                              ...prev,
                              gender: "Male",
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="male">
                          Male
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="female"
                          value="female"
                          checked={employeeObj.gender === "Female"}
                          onChange={(e) =>
                            setEmployeeObj((prev) => ({
                              ...prev,
                              gender: "Female",
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="female">
                          Female
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input mx-2"
                          type="radio"
                          name="inlineRadioOptions"
                          id="other"
                          value="other"
                          checked={employeeObj.gender === "Other"}
                          onChange={(e) =>
                            setEmployeeObj((prev) => ({
                              ...prev,
                              gender: "Other",
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="other">
                          Other
                        </label>
                      </div>
                      <span className="validationmsg">
                        {validationError.genderError &&
                        (employeeObj.gender === undefined ||
                          employeeObj.gender == null ||
                          employeeObj.gender === "")
                          ? validationError.genderError
                          : ""}
                      </span>
                    </div>{" "}
                    <div className="form-control mt-3">
                      <label className="form-label">
                        <strong>
                          Select State<span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <button
                        type="button"
                        class="btn btn addnew"
                        onClick={() => handleState()}
                      >
                        +Add new state
                      </button>
                      <select
                        className="form-control"
                        value={employeeObj.state || 0}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            state: e.target.value,
                            city: 0,
                            taluka: 0,
                          }))
                        }
                      >
                        <option value={0} disabled>
                          select state..
                        </option>
                        {stateList.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <span className="validationmsg">
                        {validationError.stateError &&
                        (employeeObj.state === undefined ||
                          employeeObj.state === null ||
                          employeeObj.state === 0)
                          ? validationError.stateError
                          : ""}
                      </span>
                    </div>
                    <div className="form-control mt-3">
                      <label className="form-label">
                        <strong>
                          Select City<span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <button
                        type="button"
                        class="btn btn addnew"
                        onClick={() => handleCity()}
                      >
                        +add new city
                      </button>
                      <select
                        className="form-control"
                        value={employeeObj.city || 0}
                        onChange={(e) => handleSelectCity(e.target.value)}
                      >
                        <option value={0} disabled>
                          select city..
                        </option>
                        {cityList.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <span className="validationmsg">
                        {validationError.cityError &&
                        (employeeObj.city === undefined ||
                          employeeObj.city === null ||
                          employeeObj.city === 0)
                          ? validationError.cityError
                          : ""}
                      </span>
                    </div>
                    <div className="form-control mt-3">
                      <label className="form-label">
                        <strong>
                          Select Taluka<span className="validationmsg">*</span>
                        </strong>
                      </label>
                      <button
                        type="button"
                        class="btn btn addnew"
                        onClick={() => handleTaluka()}
                      >
                        +add new Taluka
                      </button>
                      <select
                        className="form-control"
                        value={employeeObj.taluka || 0}
                        onChange={(e) =>
                          setEmployeeObj((prev) => ({
                            ...prev,
                            taluka: e.target.value,
                          }))
                        }
                      >
                        <option value={0} disabled>
                          select taluka..
                        </option>
                        {talukaList.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <span className="validationmsg">
                        {validationError.talukaError &&
                        (employeeObj.taluka === undefined ||
                          employeeObj.taluka === null ||
                          employeeObj.taluka === 0)
                          ? validationError.talukaError
                          : ""}
                      </span>
                    </div>
                    <label className="form-control mt-3">
                      <strong>
                        Select Working Area
                        <span className="validationmsg">*</span>{" "}
                      </strong>
                      <ReactSelect
                        isMulti
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={talukaList.map((state) => ({
                          value: state.id,
                          label: state.name,
                        }))}
                      />
                      <span className="validationmsg">
                        {validationError.workingAreaError &&
                        (employeeObj.workingArea === undefined ||
                          employeeObj.workingArea === null ||
                          employeeObj.workingArea.length === 0 ||selectedOption.length==0)
                          ? validationError.workingAreaError
                          : ""}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => clear()}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {method === "edit" ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <State
        stateList={stateList}
        getState={getState}
        handleStateModal={handleStateModal}
        modalStatus={modalStatus}
        // setSelectedOption={setSelectedOption}
        setModalStatus={setModalStatus}
      />
      {cityModal && (
        <City
          
          handleCityModal={handleCityModal}
          getCityByState={getCityByState}
          cityModal={cityModal}
         
          setCityModal={setCityModal}
          state={employeeObj.state}
          cityList={cityList}
        />
      )}
      {talukaModal && (
        <Taluka
        talukaList={talukaList}
          getTalukaByCities={getTalukaByCities}
          handleTalukaModal={handleTalukaModal}
          cityList={cityList}
          talukaModal={talukaModal}
          setTalukaModal={setTalukaModal}
          city={employeeObj.city}
        />
      )}
    </>
  );
};
