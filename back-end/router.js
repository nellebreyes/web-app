const router = require("express").Router();
const userController = require("./controllers/userController");

router.get("/", (req, res) => res.json("Backend is up and running."));

//user related routes
router.post(
  "/profile/:id",
  userController.apiMustBeLoggedIn,
  userController.profileBasicData
);

router.post(
  "/profile/:id/edit",
  //userController.apiMustBeLoggedIn,
  userController.apiProfileUpdateBasicData
);
router.post("/register", userController.apiRegister);
router.post("/login", userController.apiLogin);

module.exports = router;
