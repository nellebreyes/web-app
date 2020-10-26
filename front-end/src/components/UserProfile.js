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
          photo: response.data.photo.data,
        });
        // console.log(response.data.photo.data);
      } catch (err) {
        console.log("there was a problem");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="profile-section">
      <h2>Profile Page</h2>
      <i class="fas fa-ellipsis-h fa-2x mb-2"></i>
      <div className="profilePhoto">
        <img src={`data:image/jpeg;base64,${profileData.photo}`} />
      </div>
      <p className="email">{profileData.email}</p>
      <div className="content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec
          pretium vulputate sapien nec sagittis. Mauris in aliquam sem fringilla
          ut morbi tincidunt. Sed nisi lacus sed viverra tellus in hac.
          Suspendisse potenti nullam ac tortor vitae purus faucibus. Leo duis ut
          diam quam nulla porttitor massa. Velit sed ullamcorper morbi tincidunt
          ornare massa eget. Rhoncus mattis rhoncus urna neque viverra justo
          nec. Libero justo laoreet sit amet cursus sit amet dictum sit. Et
          pharetra pharetra massa massa ultricies mi quis hendrerit. Velit
          euismod in pellentesque massa placerat duis ultricies lacus. Euismod
          in pellentesque massa placerat duis ultricies lacus sed turpis. Eu
          tincidunt tortor aliquam nulla facilisi cras. Scelerisque felis
          imperdiet proin fermentum leo. Sed viverra ipsum nunc aliquet
          bibendum. Porttitor leo a diam sollicitudin tempor id eu. Eget nunc
          scelerisque viverra mauris in. Ac tortor dignissim convallis aenean et
          tortor at risus. Condimentum id venenatis a condimentum vitae sapien
          pellentesque habitant morbi. Sed enim ut sem viverra aliquet. Sit amet
          massa vitae tortor condimentum lacinia quis. Mollis nunc sed id semper
          risus in hendrerit. Mauris a diam maecenas sed.
        </p>
      </div>
    </div>
  );
}

export default UserProfile;
