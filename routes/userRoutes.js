module.exports = (userCollection, otpCollection, forgetOTPCollection) => {
  const express = require("express");
  const router = express.Router();
  const userController = require("../controllers/userController");

  router.post("/users/register", userController.registerUser(userCollection));
  router.get("/users", userController.getAllUsers(userCollection));
  router.get("/users/:email", userController.getAUserByEmail(userCollection));
  router.post(
    "/users/login",
    userController.loginUser(userCollection, otpCollection)
  );
  router.patch(
    "/users/change-password",
    userController.changePassword(userCollection)
  );
  router.patch(
    "/users/update-profile/:email",
    userController.updateUserProfile(userCollection)
  );
  router.post(
    "/users/verifyOTP",
    userController.verifyOPT(userCollection, otpCollection)
  );
  router.post("/users/resendOTP", userController.resendOTP(otpCollection));
  router.post(
    "/users/forgetPassword",
    userController.forgetPassword(forgetOTPCollection)
  );
  router.post(
    "/users/verifyForgetOTP",
    userController.verifyForgetOTP(forgetOTPCollection)
  );
  router.patch(
    "/users/updatePassword",
    userController.updatePasswordByForgetOTP(
      userCollection,
      forgetOTPCollection
    )
  );

  router.get(
    "/users/reviews/bulkUser",
    userController.getBulkUser(userCollection)
  );

  return router;
};
