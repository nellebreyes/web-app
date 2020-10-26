import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

function UserProfile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({
    email: "",
    photo: "",
  });

  //only run this function the very first time the component is rendered
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(
          `${process.env.REACT_APP_API_URL}/profile/${id}`,
          { token: localStorage.getItem("webappv2Token") }
        );

        setProfileData({
          email: response.data.email,
          photo: response.data.url,
        });
      } catch (err) {
        console.log("there was a problem");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="profilePhoto">
        <img
          className="profile-pic"
          scr={`${process.env.REACT_APP_API_URL}/profile/${id}`}
          alt="profile pic"
        />
      </div>
      <p className="email">Email: {profileData.email}</p>
    </div>
  );
}

export default UserProfile;
