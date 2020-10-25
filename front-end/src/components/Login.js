import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import ContextProvider from "../ContextProvider";

const Login = (props) => {
  const setStatus = useContext(ContextProvider);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //destructure
  const { email, password } = values;

  //HOF for cleaner state change handling
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await Axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password }
      );
      //console.log(response);
      if (response.data) {
        localStorage.setItem("webappv2Token", response.data.token);
        localStorage.setItem("webappv2Email", response.data.email);
        setStatus(Boolean(true));
        props.history.push(`/profile/${response.data.id}`);
      } else {
        console.log("Incorrect username / password");
      }
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

export default withRouter(Login);
