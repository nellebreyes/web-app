import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import ContextProvider from "../ContextProvider";

function UserIsLoggedIn() {
  const setStatus = useContext(ContextProvider);

  function handleLogout() {
    setStatus(Boolean(false));
    localStorage.removeItem("webappv2Token");
    localStorage.removeItem("webappv2Email");
  }

  return (
    <div className="header">
      <div className="header-container">
        <div className="logo">
          <h1>
            <NavLink to="/" alt="Web&nbsp;App">
              Web App
            </NavLink>
          </h1>
        </div>
        <div className="nav">
          <ul>
            <li>
              <NavLink onClick={handleLogout} activeClassName="active" to="/">
                Sign Out
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserIsLoggedIn;
