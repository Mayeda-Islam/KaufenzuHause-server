module.exports = (userCollection) => {
  const express = require("express");
  const router = express.Router();
  const userController = require("../controllers/userController");

  router.post("/users/register", userController.registerUser(userCollection));
  router.get("/users", userController.getAllUsers(userCollection));
  router.get(
    "/users/:identifier",
    userController.getAUserByIdentifier(userCollection)
  );
  router.post("/users/login", userController.loginUser(userCollection));
  router.patch(
    "/users/change-password",
    userController.changePassword(userCollection)
  );

  return router;
};
