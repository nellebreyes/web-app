import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserIsLoggedOut from "./UserIsLoggedOut";
import UserIsLoggedIn from "./UserIsLoggedIn";

function Header() {
  const [loggedIn, setLoggedIn] = useState();
  return (
    <>
      {loggedIn ? (
        <UserIsLoggedIn />
      ) : (
        <UserIsLoggedOut setLoggedIn={setLoggedIn} />
      )}
    </>
  );
}

export default Header;
