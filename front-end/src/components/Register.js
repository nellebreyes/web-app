import React, { useState, useEffect } from "react";

const Register = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    formData: "",
  });

  //destructure to grab easily
  const { email, password, confirmPassword, formData } = values;

  //this will run everytime the component mounts and the values change
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
  }, []);

  //high order function, function returning another function
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    //using the rest operator, take the rest of the values
    setValues({ ...values, [name]: value });
  };

  const register = (formData) => {
    console.log(formData);
    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values });
    register(formData);
  };

  const RegisterForm = () => (
    <form autoComplete="off" onSubmit={clickSubmit}>
      <label htmlFor="email">Email</label>
      <div>
        <input
          type="email"
          name="email"
          id="email"
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
      {JSON.stringify(values)}
    </div>
  );
};

export default Register;
