import React, { useState } from "react";
import Axios from "axios";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { email, password } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  // const clickSubmit = (event) => {
  //   event.preventDefault();
  //   fetch(`${process.env.REACT_APP_API_URL}/login`, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ email, password }),
  //   })
  //     .then(function (response) {
  //       console.log(response);
  //       localStorage.setItem("webAppv2Email", response.token);
  //     })
  //     .catch(function () {
  //       console.log("Please try again later");
  //     });
  // };

  const clickSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );
      //console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const loginForm = () => (
    <form onSubmit={clickSubmit} autoComplete="off">
      <label htmlFor="email">Email</label>
      <div>
        <input
          type="email"
          name="email"
          id="email"
          onChange={handleChange("email")}
        />
      </div>
      <label htmlFor="password">Password</label>
      <div>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleChange("password")}
        />
      </div>
      <button type="submit ">Login</button>
    </form>
  );

  return (
    <div className="form-container">
      <h2>Login</h2>
      {loginForm()}
    </div>
  );
};

export default Login;
