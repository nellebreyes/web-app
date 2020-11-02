import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import Axios from "axios";
Axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "https://auth-webapp2.herokuapp.com/api";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
