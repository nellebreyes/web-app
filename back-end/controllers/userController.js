const User = require("../models/User");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");

exports.checkToken = (req, res) => {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

exports.apiMustBeLoggedIn = (req, res, next) => {
  try {
    //args: incoming token and the jwtsecret
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    next();
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

exports.doesEmailExist = (req, res) => {
  User.findByEmail(req.body.mail.toLowerCase())
    .then(function () {
      res.json(true);
    })
    .catch(function (e) {
      res.json(false);
    });
};

exports.apiLogin = (req, res) => {
  let user = new User(req.body);
  //console.log(req.body);
  user
    .login()
    .then(function () {
      res.json({
        token: jwt.sign(
          { _id: user.data._id, email: user.data.email },
          process.env.JWTSECRET,
          { expiresIn: "365d" }
        ),
        email: user.data.email,
      });
    })
    .catch(function (e) {
      res.json(false);
    });
};

exports.apiRegister = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  try {
    form.parse(req, (fields, files));
    let user = new User({ fields, files });
    user
      .register()
      .then(() => {
        res.json({
          token: jwt.sign(
            { _id: user.data._id, email: user.data.email },
            process.env.JWTSECRET,
            { expiresIn: tokenLasts }
          ),
          email: user.data.email,
        });
      })
      .catch((regErrors) => {
        throw regErrors;
      });
  } catch (e) {
    res.send(e);
  }
};

exports.apiGetUserHome = async (req, res) => {
  try {
    let userData = await User.getUserPhoto(req.apiUser.email);
    res.json(userData);
  } catch (e) {
    res.status(500).send("Error");
  }
};

exports.ifUserExists = (req, res, next) => {
  User.findByEmail(req.params.email)
    .then(function (userDocument) {
      req.profileUser = userDocument;
      next();
    })
    .catch(function (e) {
      res.json(false);
    });
};

exports.profileBasicData = (req, res) => {
  res.json({
    profileEmail: req.profileUser.email,
  });
};
