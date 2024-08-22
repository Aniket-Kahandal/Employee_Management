import React, { useEffect, useState } from "react";
import "./formdata.css";
import { specialChars } from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
function Form() {
  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  // Validation  States
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [maxiD, setMaxID] = useState();

/* Another method for validations
  // const [errors,setErrors]=useState({
  //   firstNameError:"",
  //   lastNameError:"",
  //   emailError:"",
  //   passwordError:"",
  //   confirmPasswordError:""
  // })
  // Add Form Data
  */
  // Get Max id from database
  const getMaxId = () => {
    fetch("http://localhost:8085/data")
      .then((response) => response.json())
      .then((result) => {
        setMaxID(Math.max(...result.map((id) => id.id)));
      });
  };
  // Submit Form Data
  const handleSubmit = (e) => {
    e.preventDefault();
    getMaxId();
    const isvalid = validateForm();
    if (!isvalid) {
      fetch("http://localhost:8085/data", {
        method: "POST",
        body: JSON.stringify({
          id: "" + (maxiD + 1),
          name: "" + firstName + " " + lastName,
          password: password,
          email: email,
        }),
        headers: { "content-type": "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          alert("Data added");
          clear();
        });
    }
  };
  // Clear all states
  const clear = () => {
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setLastNameError("");
    setFirstNameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmail("");
    setEmailError("");
  };
  /* Function for set Errors it is another way to setErrors
  const handleError=(key,value)=>{
     setErrors((preError)=>({
      ...preError,[key]:value
     }))
  }
     */
  // validation Checks
  const validateForm = () => {
    debugger;
    const length = 8;
    const hasLowerChar = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[~!@#$%^&*()_+=?><:"]/.test(password);
    const hasDigit = /\d/.test(password);

    let isvalid = false;
    if (!firstName.trim()) {
      setFirstNameError("Required");
      // handleError("firstNameError","Required");
      isvalid = true;
    }
    if (!lastName.trim()) {
      setLastNameError("Required");
      isvalid = true;
    }

    if (!hasDigit) {
      setPasswordError("Must contains Digit");
      isvalid = true;
    }
    if (!hasLowerChar) {
      setPasswordError("Must contains Lower Character");
      isvalid = true;
    }
    if (!hasUpperCase) {
      setPasswordError("Must contains Uppercase Character");
      isvalid = true;
    }
    if (!hasSpecialChar) {
      setPasswordError("Must contains special character");
      isvalid = true;
    }
    if (password.length < length) {
      setPasswordError("Password must be 8 characters");
      isvalid = true;
    }
    if (!password.trim() || password.length == 0) {
      setPasswordError("Required");
      isvalid = true;
    }
    if (
      !confirmPassword.trim() ||
      confirmPassword === undefined ||
      confirmPassword === null ||
      confirmPassword == ""
    ) {
      setConfirmPasswordError("Required");
    }
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Password not match");
      isvalid = true;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Email is not valid");
      isvalid = true;
    }
    if (!email.trim()) {
      setEmailError("Required");
      isvalid = true;
    }
    return isvalid;
  };
  // Toggle to view password
  const handleShowPass = () => {
    setShowPass(!showPass);
  };
  // toggle to view Confirmed password
  const handleShowConfirmPass = () => {
    setShowConfirmPass(!showConfirmPass);
  };
  return (
    <>
      <div className="container m-5 div1">
       
        <h1 className="text-center formHead">Registration Form</h1>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="form">
            <label htmlFor="email" className="form-label mx-3">
              <strong> Email id</strong>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="form-control w-50 m-3"
              id="email"
              value={email}
              style={{ display: "inline" }}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="errormsg">
              {emailError &&
              (!email.trim() || !email.includes("@") || !email.includes("."))
                ? emailError
                : ""}
            </span>
          </div>
          <div className="col-md-6">
            <label htmlFor="firstName" className="form-label">
              <strong>First Name</strong>
            </label>
            <input
              type="text"
              placeholder="first Name"
              className="form-control"
              value={firstName}
              id="firstName"
              onChange={(e) =>
                setFirstName(e.target.value.replace(/[^a-z,A-Z]/g, ""))
              }
            />
            <span className="errormsg">
              {firstNameError &&
              (firstName === "" ||
                firstName === undefined ||
                firstName === null)
                ?firstNameError
                : ""}
            </span>
          </div>
          <div className="col-md-6">
            <label htmlFor="lastName" className="form-label">
              <strong> Last Name</strong>
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value.replace(/[^a-z,A-Z]/g, ""))
              }
            />
            <span className="errormsg">
              {lastNameError &&
              (lastName === "" || lastName === undefined || lastName === null)
                ? lastNameError
                : ""}
            </span>
          </div>
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">
              <strong> Password</strong>
            </label>
            <span
              className="btn btn"
              style={{ float: "right" }}
              onClick={() => handleShowPass()}
            >
              {showPass ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-eye"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              )}
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="8 digit Password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span className="errormsg">
              {(passwordError &&
                (password === "" ||
                  password == undefined ||
                  password === null ||
                  password.length < 8)) ||
              !/[\d]/.test(password) ||
              !/[A-Z]/.test(password) ||
              !/[a-z]/.test(password) ||
              !/[~!@#$%^&*()_+=?><:"]/.test(password)
                ? passwordError
                : ""}
            </span>
            {password.length < 8 && (
              <p className="mt-2">
                Password must contains 1-speacial characters , 1-uppercase
                characters ,1-lowercase character,1-digit{" "}
              </p>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="confirmPassword" className="form-label">
              <strong> Confirm Password</strong>
            </label>
            <span
              className="btn btn"
              style={{ float: "right" }}
              onClick={() => handleShowConfirmPass()}
            >
              {showConfirmPass ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-eye"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              )}
            </span>
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="confirm password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span className="errormsg">
              {confirmPasswordError &&
              (confirmPassword === "" ||
                confirmPassword == undefined ||
                confirmPassword === null ||
                confirmPassword.length < 8 ||
                confirmPassword !== password)
                ? confirmPasswordError
                : ""}
            </span>
          </div>

          <span className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </span>
        </form>
      </div>
    </>
  );
}
export default Form;
