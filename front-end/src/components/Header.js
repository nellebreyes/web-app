import React from "react";
import UserIsLoggedOut from "./UserIsLoggedOut";
import UserIsLoggedIn from "./UserIsLoggedIn";

function Header(props) {
  return <>{props.status ? <UserIsLoggedIn /> : <UserIsLoggedOut />}</>;
}

export default Header;
