import React from "react";
import { NavLink } from "react-router-dom";

function UserIsLoggedOut() {
  return (
    <div className="header">
      <div className="header-container">
        <div className="logo">
          <h1>
            <NavLink to="/" alt="Web App">
              Web&nbsp;App
            </NavLink>
          </h1>
        </div>
        <div className="nav">
          <ul>
            <li>
              <NavLink activeClassName="active" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/register">
                Register
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserIsLoggedOut;
