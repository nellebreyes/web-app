const router = require("express").Router();
const userController = require("./controllers/userController");
const cors = require("cors");

router.get("/", (req, res) => res.json("Backend is up and running."));

//user related routes
router.post(
  "/getUserHome",
  userController.apiMustBeLoggedIn,
  userController.apiGetUserHome
);
router.post("/register", userController.apiRegister);
router.post("/login", userController.apiLogin);
router.post("/doesEmailExist", userController.doesEmailExist);
// profile related routes
router.post(
  "/profile/:email",
  userController.ifUserExists,
  userController.profileBasicData
);

module.exports = router;
