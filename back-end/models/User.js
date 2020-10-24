const validator = require("validator");
const bycrypt = require("bcryptjs");
const db = require("../app");
const fs = require("fs");

let User = function (data) {
  //console.log(data);
  this.data = data;
  this.errors = [];
};

User.prototype.validate = function () {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  return new Promise(async (resolve, reject) => {
    if (this.password == "") {
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

    if (this.confirmPassword == "") {
      this.errors.push("Confirm password is required.");
    } else if (this.password !== this.confirmPassword) {
      this.errors.push("Password and confirm password must match.");
    }

    if (this.email == "") {
      this.errors.push("Email is required.");
    } else if (!validator.isEmail(this.email)) {
      this.errors.push("You must enter a valid email.");
    }

    if (this.photo.size == 0 || this.photo.size > 100000) {
      this.errors.push("Photo is required.");
    } else if (!validator.isMimeType(this.photo.contentType)) {
      this.errors.push("Photo must be in jpg, png, giff, tiff or webp format");
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

User.prototype.register = async function () {
  return new Promise(async (resolve, reject) => {
    // console.log(this.data);
    let { fields, files } = this.data;
    let photoObj = files.photo;

    let photo = {
      data: fs.readFileSync(photoObj.path),
      name: photoObj.name,
      contentType: photoObj.type,
      size: photoObj.size,
    };

    this.email = fields.email.toLowerCase().trim();
    this.password = fields.password;
    this.confirmPassword = fields.confirmPassword;
    this.photo = photo;
    //step 1 validate user data //since we added async function to validate method, we need to make sure that that is
    //completed before we allow other steps to happen
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
  return new Promise((resolve, reject) => {
    console.log(this.data);
    this.data.email = this.data.email.toLowerCase().trim();

    //NOTE: do not forget to pass-in the logger parameter
    usersCollection
      .findOne({ email: this.data.email })
      .then((logger) => {
        //args: incoming pw and saved pw
        if (
          logger &&
          bycrypt.compareSync(this.data.password, logger.password)
        ) {
          resolve("Thank you for loggin in");
        } else {
          reject("Invalid email or password");
        }
      })
      .catch(function () {
        reject("Invalid email or password");
      });
  });
};

User.findByEmail = function (email) {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  return new Promise(function (resolve, reject) {
    if (typeof email != "string") {
      reject();
      return;
    }
    usersCollection
      .findOne({ email: email })
      .then(function (userDoc) {
        if (userDoc) {
          userDoc = new User(userDoc, true);
          userDoc = {
            _id: userDoc.data._id,
            email: userDoc.data.email,
          };
          resolve(userDoc);
        } else {
          reject();
        }
      })
      .catch(function (e) {
        reject();
      });
  });
};

User.doesEmailExist = function (email) {
  let con = db.dbfunc;
  let usersCollection = con.collection("users");
  return new Promise(async function (resolve, reject) {
    if (typeof email != "string") {
      resolve(false);
      return;
    }

    let user = await usersCollection.findOne({ email: email });
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

module.exports = User;
