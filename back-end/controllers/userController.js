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
        id: user.data._id,
      });
    })
    .catch(function (e) {
      res.json(false);
    });
};

exports.apiRegister = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    let user = new User({ fields, files });

    try {
      const result = user.register();
      console.log("user registration result", result);
      if (result) {
        res.json({
          token: jwt.sign(
            { _id: user.data._id, email: user.data.email },
            process.env.JWTSECRET,
            { expiresIn: "365d" }
          ),
          email: user.data.email,
        });
      } else {
        return res.status(400).json({ error: "Failed to register" });
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });
};

// exports.apiRegister = async (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   let user;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }
//     user = new User({ fields, files });
//   });

//   try {
//     const result = await user.register();
//     console.log("user registration result", result);
//     if (result) {
//       res.json({
//         token: jwt.sign(
//           { _id: user.data._id, email: user.data.email },
//           process.env.JWTSECRET,
//           { expiresIn: "365d" }
//         ),
//         email: user.data.email,
//       });
//     } else {
//       return res.status(400).json({ error: "Failed to register" });
//     }
//   } catch (e) {
//     return res.status(400).json({ error: e });
//   }
// };

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
