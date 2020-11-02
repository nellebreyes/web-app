import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";

function EditUserProfile(props) {
  const { id } = useParams();
  const [profileData, setProfileData] = useState({
    photo: "",
  });

  const [values, setValues] = useState({
    email: "",
    photo: "",
    error: "",
    loading: false,
    formData: new FormData(),
  });

  //destructure to grab easily
  const { error, photo, formData } = values;

  //validate photo input
  let counter;
  function validateInput(inputName, e) {
    setValues({ ...values, [inputName]: e.target.value });
    if (inputName === "photo") {
      let photo = e.target.value;
      if (photo === "") {
        counter++;
        setValues({ error: "Photo is required." });
        return;
      } else {
        setValues({ ...values, [inputName]: e.target.value });
      }
    }
  }

  //send request to db to update photo
  const update = async () => {
    const response = await Axios.post(
      `${Axios.defaults.baseURL}/profile/${id}/edit`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          id: `${id}`,
        },
      }
    );

    setProfileData({
      photo: response.data.value.photo.data,
    });
    setValues({ ...values, photo: profileData.photo });
  };

  //high order function, function returning another function
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    validateInput(name, event);
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(
          `${Axios.defaults.baseURL}/profile/${id}`,
          { token: localStorage.getItem("webappv2Token") }
        );

        setProfileData({
          email: response.data.email,
          photo: response.data.photo.data,
        });
        // console.log(response.data.photo.data);
      } catch (err) {
        //console.log("there was a problem");
      }
    }
    fetchData();
  }, [id, photo]);

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    validateFields();
    if (counter !== 0) {
      update();
    }
  };

  const validateFields = (e) => {
    for (let key in values) {
      let name = key;
      if (values[key] === "") {
        switch (name) {
          case "photo":
            name = "photo.";
            break;
          case "loading":
            continue;
          case "error":
            continue;
          case "formData":
            continue;
          default:
            name = key;
        }
        setValues({ error: `You must provide ${name}` });
        setValues({ ...values, [key]: values[key] });
        return;
      } else {
        setValues({ error: "" });
      }
    }
  };
  //end of validation

  return (
    <Page title="EditProfile">
      <form
        autoComplete="off"
        className="form-container"
        onSubmit={clickSubmit}
      >
        <div className="profilePhoto">
          <h4 className="mb-2">
            <i className="far fa-hand-point-left"></i>{" "}
            <NavLink exact to={`/profile/${id}`}>
              Back to Profile Page
            </NavLink>
          </h4>
          <img
            src={`data:image/jpeg;base64,${profileData.photo}`}
            alt="profile"
          />
        </div>

        <p></p>
        <p className="email">Email: {profileData.email}</p>
        <div>
          <label htmlFor="photo">
            Upload new photo
            <input
              type="file"
              name="photo"
              id="myFile"
              accept="image/*"
              onChange={handleChange("photo")}
            />
          </label>
        </div>
        <button type="submit " className="mb-2">
          Submit change
        </button>
        <p style={{ color: "red", fontWeight: "500" }}>{error}</p>
      </form>
    </Page>
  );
}

export default EditUserProfile;
