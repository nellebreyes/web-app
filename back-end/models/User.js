const validator = require("validator");
const bycrypt = require("bcryptjs");
const db = require("../app");
const fs = require("fs");
const { ObjectId } = require("mongodb");

let User = function (data) {
  //console.log(data);
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  return new Promise(async (resolve, reject) => {
    if (this.password === "") {
      this.errors.push(
        "Password must be between 8-30 alphanumeric characters."
      );
    } else if (!validator.isAlphanumeric(this.password)) {
      this.errors.push(
        "Password must NOT contain any special character, only letters and numbers are allowed."
      );
    } else if (
      this.password.length > 0 &&
      (this.password.length < 8 || this.password.length > 30)
    ) {
      this.errors.push(
        "Password must be between 8-30 alphanumeric characters."
      );
    }

    if (this.confirmPassword === "") {
      this.errors.push("Confirm password is required.");
    } else if (this.password !== this.confirmPassword) {
      this.errors.push("Password and confirm password must match.");
    }

    if (this.email === "") {
      this.errors.push("Email is required.");
    } else if (!validator.isEmail(this.email)) {
      this.errors.push("You must enter a valid email.");
    }

    //only when the email is valid then check to see if it's taken
    if (validator.isEmail(this.email)) {
      const targetEmail = await usersCollection.findOne({ email: this.email });
      if (targetEmail) {
        this.errors.push("The email entered already exists.");
      }
    }
    resolve();
  });
};

User.prototype.register = function () {
  //step 1 validate user data //since we added async function to validate method, we need to make sure that that is
  //completed before we allow other steps to happen
  // console.log(this.data);

  return new Promise(async (resolve, reject) => {
    // if (this.data == "" || this.data == null || this.data == undefined) {
    //   this.errors.push("All fields are required");
    //   return this.errors;
    // }

    let { fields, files } = this.data;

    if (fields !== null || (fields !== "" && fields.email !== "")) {
      this.email = fields.email.toLowerCase().trim();
      this.password = fields.password;
      this.confirmPassword = fields.confirmPassword;
    }

    if (files !== null || (files !== "" && files.photo.path !== "")) {
      let photo = {
        data: fs.readFileSync(files.photo.path),
        name: files.photo.name,
        contentType: files.photo.type,
        size: files.photo.size,
      };
      this.photo = photo;
    }

    if (this.photo.size === 0) {
      this.errors.push("Photo is required.");
    } else if (!validator.isMimeType(this.photo.contentType)) {
      this.errors.push("Photo must be in jpg, png, giff, tiff or webp format");
    }
    await this.validate();
    // Step 2: Only if there are no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      let con = db.dbfunc;
      let usersCollection = con.collection("users");
      let salt = bycrypt.genSaltSync(10); //number of salt chars
      this.password = bycrypt.hashSync(fields.password, salt);

      await usersCollection.insertOne({
        email: this.email,
        password: this.password,
        photo: this.photo,
      });
      resolve();
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.login = function () {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  this.data.email = this.data.email.toLowerCase().trim();
  return new Promise((resolve, reject) => {
    usersCollection
      .findOne({ email: this.data.email })
      //logger only exists if db is able to find a matching email
      .then((logger) => {
        //args: incoming pw and saved pw
        if (
          logger &&
          bycrypt.compareSync(this.data.password, logger.password)
        ) {
          this.data = logger;
          resolve("Thank you for loggin in");
        } else {
          reject("Invalid email or password");
        }
      })
      .catch(function () {
        reject("Please try again later");
      });
  });
};

User.prototype.getProfileById = function () {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  const { id } = this.data;
  // console.log("fromUserModel", id);

  return new Promise(function (resolve, reject) {
    usersCollection
      .findOne({ _id: ObjectId(id) })
      .then(function (userDoc) {
        if (userDoc) {
          userDoc = new User(userDoc, true);
          userDoc = {
            _id: userDoc.data._id,
            email: userDoc.data.email,
            photo: userDoc.data.photo,
          };
          resolve(userDoc);
        } else {
          reject("Id not found");
        }
      })
      .catch(function (e) {
        reject(e);
      });
  });
};

User.prototype.update = function () {
  if (this.data == "" || this.data == null || this.data == undefined) {
    this.errors.push("Photo");
    return this.errors;
  }
  // console.log("incoming data in user model", this.data);
  let { err, fields, files, param } = this.data;
  //console.log("files from model", files);
  //console.log("fields from model", fields);
  // console.log("param from model", param);
  if (err) {
    this.errors.push(err);
  }

  if (files !== null || (files !== "" && files.photo.path !== "")) {
    let photo = {
      data: fs.readFileSync(files.photo.path),
      name: files.photo.name,
      contentType: files.photo.type,
      size: files.photo.size,
    };
    this.photo = photo;
    //console.log({ name: photo.name });
  }

  if (this.photo.size === 0) {
    this.errors.push("Photo is required.");
  } else if (!validator.isMimeType(this.photo.contentType)) {
    this.errors.push("Photo must be in jpg, png, giff, tiff or webp format");
  }
  // console.log("photo", this.photo);
  return new Promise(async (resolve, reject) => {
    if (!this.errors.length) {
      let con = db.dbfunc;
      let usersCollection = con.collection("users");
      //  console.log("email", this.email, "photo", this.photo);
      try {
        await usersCollection
          .findOneAndUpdate(
            { _id: ObjectId(param) },
            { $set: { photo: this.photo } },
            { new: true }
          )
          .then((result) => {
            // console.log("result", result);
            resolve(result);
            console.log(email, this.photo);
          })
          .catch((e) => {
            reject("Email not found", e);
          });
      } catch (e) {
        reject("Try again later", e);
      }
    }
  });
};
module.exports = User;
