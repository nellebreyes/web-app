import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();

  //only run this function the very first time the component is rendered
  useEffect(() => {}, []);

  return (
    <div className="container">
      <div className="profilePhoto"></div>
      <p className="email"></p>
    </div>
  );
}

export default UserProfile;
