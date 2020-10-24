import React from "react";
import { Link } from "react-router-dom";

function Header() {
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
              <Link exact to="/">
                Home
              </Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
