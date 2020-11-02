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

exports.doesIdExist = (req, res) => {
  User.findByEmail(req.body.id)
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
        id: user.data._id,
      });
    })
    .catch(function (e) {
      res.send("Invalid email or password");
    });
};

exports.apiRegister = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //  console.log("fields", fields, "files", files);
    if (
      JSON.stringify(fields) == JSON.stringify({}) ||
      JSON.stringify(files) == JSON.stringify({})
    ) {
      //console.log("all are required");
      return res.json({ error: "All fields are required" });
    } else {
      let user = new User({ err, fields, files });
      try {
        user
          .register()
          .then((result) => {
            // console.log(result);
            res.json({
              token: jwt.sign(
                { _id: user.data._id, email: user.data.email },
                process.env.JWTSECRET,
                { expiresIn: "365d" }
              ),
              email: user.data.email,
              id: user.data.id,
              message: "success",
            });
          })
          .catch((e) => {
            return res.send("The email you entered is already on file.");
          });
      } catch (e) {
        //console.log(e);
        return res.status(400).json({ error: e });
      }
    }
  });
};

exports.profileBasicData = async (req, res) => {
  //console.log("fromUserConrller", req.params);
  let user = new User(req.params);

  user
    .getProfileById()
    .then((userDoc) => {
      res.send(userDoc);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.profileUpdateBasicData = async (req, res) => {
  //console.log("fromUserConrller", req.params);
  let user = new User(req.params);

  user
    .getProfileById()
    .then((userDoc) => {
      res.send(userDoc);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.apiProfileUpdateBasicData = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //console.log(err, fields, files);
    console.log("param", req.params.id);
    //console.log(req.email, "id", req.id);
    let param = req.params.id;
    let user = new User({ err, fields, files, param });

    try {
      user
        .update()
        .then((userDoc) => {
          res.send(userDoc);
          // console.log(userDoc);
        })
        .catch((err) => {
          res.send(err);
        });
    } catch (e) {
      //console.log(e);
      return res.status(400).json({ error: e });
    }
  });
};
