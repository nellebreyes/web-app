import React, { useContext } from "react";
import { Link } from "react-router-dom";
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
            <Link to="/" alt="Web App">
              Web App
            </Link>
          </h1>
        </div>
        <div className="nav">
          <ul>
            <li>
              <Link onClick={handleLogout} to="/">
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserIsLoggedIn;
