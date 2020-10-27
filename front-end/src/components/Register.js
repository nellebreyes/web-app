import Axios from "axios";
import React, { useState, useEffect } from "react";

const Register = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    error: "",
    loading: false,
    formData: "",
  });

  //destructure to grab easily
  const { formData } = values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, []);

  //high order function, function returning another function
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const register = async () => {
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      if (response.data.message == "success") {
        setValues({
          email: "",
          password: "",
          confirmPassword: "",
          photo: "",
          error: "",
          loading: false,
          formData: "",
        });
      }
    } catch (e) {
      if (e.response.data.error.length > 0) {
        console.log(e.response.data.error);
      } else {
        console.log("All fields are required", e.response.data.error);
      }
    }
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    register();
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
      <button type="submit ">Create Account</button>
    </form>
  );
  return (
    <div className="form-container">
      <h2>Register for an Account</h2>
      {RegisterForm()}
    </div>
  );
};

export default Register;
