module.exports = (userCollection, otpCollection) => {
  const express = require("express");
  const router = express.Router();
  const userController = require("../controllers/userController");

  router.post("/users/register", userController.registerUser(userCollection));
  router.get("/users", userController.getAllUsers(userCollection));
  router.get(
    "/users/:identifier",
    userController.getAUserByIdentifier(userCollection)
  );
  router.post(
    "/users/login",
    userController.loginUser(userCollection, otpCollection)
  );
  router.patch(
    "/users/change-password",
    userController.changePassword(userCollection)
  );
  router.patch(
    "/users/update-profile/:id",
    userController.updateUserProfile(userCollection)
  );
  router.post(
    "/users/verifyOTP",
    userController.verifyOPT(userCollection, otpCollection)
  );

  return router;
};
