import Axios from "axios";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";

const Register = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    error: "",
    formData: new FormData(),
  });

  //destructure to grab easily
  const { password, confirmPassword, formData } = values;

  //high order function, function returning another function
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    validateInput(name, event);
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const register = async () => {
    const response = await Axios.post(
      `${Axios.defaults.baseURL}/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response.data);
    if (response.data.message === "success" && response.data.token) {
      alert(
        "You have successfully registered, you will be redirected to the login page"
      );
      props.history.push(`/`);
    } else {
      console.log(response.data);
      if (response.data === "The email you entered is already on file.") {
        alert(response.data);
      }
    }
  };

  //validation of input fields
  let [error, setError] = useState("");
  let counter;
  //email regex
  const isEmail = (email) => {
    const expression = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return expression.test(String(email).toLowerCase());
  };

  //aphanumeric password between 8 to 30 chars
  const isValidPW = (password) => {
    const expression = /^(?=.*[a-z]).{8,30}$/;
    return expression.test(password);
  };

  //test if passwords and confirm password are the same
  const isSame = (password, confirmpassword) => {
    return confirmpassword === password ? true : false;
  };

  //real time input validation
  function validateInput(inputName, e) {
    setValues({ ...values, [inputName]: e.target.value });

    if (inputName === "email") {
      let email = e.target.value;
      if (!isEmail(email)) {
        counter++;
        setError("Email must be in valid format");
        return;
      } else if (email === "") {
        setError("Email is required");
        setValues({ ...values, [inputName]: e.target.value });
      } else {
        setError("");
        setValues({ ...values, [inputName]: e.target.value });
      }
    }
    if (inputName === "password") {
      let password = e.target.value;
      if (!isValidPW(password)) {
        counter++;
        setError(
          "Password must be alphanumeric , min of 8 up to 30 characters."
        );
        return;
      } else if (password === "") {
        setError("Password is required");
        setValues({ ...values, [inputName]: e.target.value });
      } else {
        setError("");
        setValues({ ...values, [inputName]: e.target.value });
      }
    }

    if (inputName === "confirmPassword") {
      let confirmPassword = e.target.value;
      if (!isSame(password, confirmPassword)) {
        counter++;
        setError("Confirm password and password must match");
        return;
      } else if (confirmPassword === "") {
        setError("Confirm password is required");
        return;
      } else {
        setError("");
        setValues({ ...values, [inputName]: e.target.value });
      }
    }

    if (inputName === "photo") {
      let photo = e.target.value;
      if (photo === "") {
        counter++;
        setError("Photo is required.");
        return;
      } else {
        setError("");
        setValues({ ...values, [inputName]: e.target.value });
      }
    }
  }
  //validate before submit
  //the number of cases must equal the number of fieds to validate, see validateInput function
  const validateFields = (e) => {
    for (let key in values) {
      let name = key;
      if (values[key] === "") {
        switch (name) {
          case "email":
            name = "email.";
            break;
          case "password":
            name = "password.";
            break;
          case "confirmPassword":
            name = "confirmPassword.";
            break;
          case "photo":
            name = "photo.";
            break;
          case "error":
            continue;
          case "formData":
            continue;
          default:
            name = key;
        }
        setError(`You must provide ${name}`);
        setValues({ ...values, [key]: values[key] });
        return;
      } else if (key === "email" && !isEmail(values[key])) {
        setError("Invalid email, enter a valid email");
        setValues({ ...values, [key]: values[key] });
        return;
      } else if (key === "password" && !isValidPW(values[key])) {
        setError(
          "Password is required, in alphanumeric and should be between 8-30 chars"
        );
        setValues({ ...values, [key]: values[key] });
        return;
      } else if (
        key === "confirmPassword" &&
        !isSame(password, confirmPassword)
      ) {
        setError("Confirm password and password must match");
        setValues({ ...values, [key]: values[key] });
        return;
      } else {
        setError("");
      }
    }
  };
  //end of validation

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    validateFields();
    if (counter !== 0) {
      register();
    }
  };

  const RegisterForm = () => (
    <form autoComplete="off" onSubmit={clickSubmit}>
      <label htmlFor="email">Email</label>
      <div>
        <input
          type="email"
          name="email"
          id="email"
          autoFocus
          placeholder="Enter a valid email"
          onChange={handleChange("email")}
        />
      </div>
      <label htmlFor="password">Password</label>
      <div>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          onChange={handleChange("password")}
        />
      </div>
      <label htmlFor="confirmPassword">Confirm Password</label>
      <div>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
          onChange={handleChange("confirmPassword")}
        />
      </div>

      <div>
        <label htmlFor="photo">
          Profile Image
          <input
            type="file"
            name="photo"
            id="myFile"
            accept="image/*"
            onChange={handleChange("photo")}
          />
        </label>
      </div>
      <button type="submit " className="mb-2">
        Create Account
      </button>
      <p style={{ color: "red", fontWeight: "500" }}>{error}</p>
    </form>
  );
  return (
    <div className="form-container">
      <h2>Register for an Account</h2>
      {RegisterForm()}
    </div>
  );
};

export default withRouter(Register);
