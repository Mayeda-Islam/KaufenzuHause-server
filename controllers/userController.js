const { ObjectId } = require("mongodb");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { sendOTPVerificationEmail } = require("../utils/sendEmail");

const generateJWT = (_email) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _email }, jwtKey);
};

const registerUser = (userCollection) => async (req, res) => {
  const { fullName, gender, email, phoneNumber, password, role } = req.body;
  try {
    if (!validator.isEmail(email)) {
      return res.send({
        status: "fail",
        message: "Invalid email format",
      });
    }

    const userExist = await userCollection.findOne({ email: email });

    if (userExist) {
      return res.send({
        status: "fail",
        message: "User already exists",
      });
    }

    if (password.length < 7) {
      return res.send({
        status: "fail",
        message: "Password should be 8 characters or more",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.send({
        status: "fail",
        message:
          "Please add at least one lowercase, uppercase, numbers, and symbols",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const jwtToken = await generateJWT(email);

    await userCollection.insertOne({
      fullName,
      gender,
      email,
      phoneNumber,
      password: hashPassword,
      jwtToken,
      role,
      isVerified: false,
    });

    const newUser = await userCollection.findOne(
      { email: email },
      { projection: { password: 0 } }
    );

    res.send({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Failed to create user",
    });
  }
};

const getAllUsers = (userCollection) => async (req, res) => {
  try {
    const data = await userCollection
      .find({}, { projection: { password: 0 } })
      .toArray();

    res.send({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.send({
      status: "failed",
      message: "Something went wrong with users",
    });
  }
};

const getAUserByEmail = (userCollection) => async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userCollection.findOne(
      { email },
      { projection: { password: 0 } }
    );

    if (user) {
      res.send({
        status: "success",
        data: user,
      });
    } else {
      res.send({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (error) {
    res.send({
      status: "failed",
      message: "Something went wrong while retrieving the user",
    });
  }
};

const loginUser = (userCollection, otpCollection) => async (req, res) => {
  const { email, password } = req.body;
  try {
    // Optional checking start (Check data validity before database hit)
    if (!validator.isEmail(email)) {
      return res.send({
        status: "fail",
        message: "Invalid email format",
      });
    }

    if (password.length < 7) {
      return res.send({
        status: "fail",
        message: "Incorrect password",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.send({
        status: "fail",
        message: "Incorrect password",
      });
    }

    // Option checking end

    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.send({
        status: "fail",
        message: `${email} did not exist`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatch) {
      return res.send({
        status: "fail",
        message: "Incorrect password",
      });
    }

    if (!user?.isVerified) {
      // Send OTP for validation
      const response = await sendOTPVerificationEmail(
        otpCollection,
        user?.email,
        res
      );

      return response;
    }

    res.send({
      status: "success",
      data: {
        fullName: user?.fullName,
        email: user?.email,
        jwtToken: user?.jwtToken,
        role: user?.role,
      },
    });
  } catch (error) {
    res.send({
      status: "fail",
      message: "Failed to login",
    });
  }
};

const changePassword = (userCollection) => async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await userCollection.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(oldPassword, user?.password);

    if (!isPasswordMatch) {
      return res.send({
        status: "fail",
        message: "Old password is not correct",
      });
    }

    const newHashPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password with newHashPassword
    await userCollection.updateOne(
      { email },
      { $set: { password: newHashPassword } }
    );

    res.send({
      status: "success",
      message: "Your password is updated",
    });
  } catch (error) {
    res.send({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

const updateUserProfile = (userCollection) => async (req, res) => {
  const { email } = req.params;
  const updatedData = req.body;

  try {
    await userCollection.updateOne(
      { email },
      {
        $set: updatedData,
      }
    );
    const user = await userCollection.findOne({ email });

    res.send({
      status: "success",
      message: "Your Profile is successfully updated",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "fail",
      message: "Can not update profile",
    });
  }
};

const verifyOPT = (userCollection, otpCollection) => async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.send({
        status: "fail",
        message: "Empty details are not allowed",
      });
    }

    const userOTPRecords = await otpCollection
      .find({ email }, { projection: { _id: 0 } })
      .toArray();

    userOTPRecords.reverse();

    if (userOTPRecords.length <= 0) {
      return res.send({
        status: "fail",
        message:
          "User already verified or not exist, please register or log in",
      });
    }

    const { expiresAt } = userOTPRecords[0];
    const hashedOTP = userOTPRecords[0]?.otp;

    if (expiresAt < Date.now()) {
      return res.send({
        status: "fail",
        message: "OTP code has expired, please request again",
      });
    }

    const isValidOTP = await bcrypt.compare(otp, hashedOTP);

    if (!isValidOTP) {
      return res.send({
        status: "fail",
        message: "OTP is invalid",
      });
    }

    await userCollection.updateOne({ email }, { $set: { isVerified: true } });

    await otpCollection.deleteMany({
      email,
    });

    res.send({
      status: "success",
      message: "User verified successfully",
    });
  } catch (error) {
    res.send({
      status: "fail",
      message:
        "User already verified or not exist, please register or log in 99",
    });
  }
};

const resendOTP = (otpCollection) => async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.send({
        status: "fail",
        message: "Empty email address",
      });
    }

    // Send OTP for validation
    const response = await sendOTPVerificationEmail(otpCollection, email, res);

    return response;
  } catch (error) {
    res.send({
      status: "fail",
      message: "Failed to resend OTP",
    });
  }
};

const forgetPassword = (forgetOTPCollection) => async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.send({
        status: "fail",
        message: "Empty email address",
      });
    }

    // Send OTP for forget password
    const response = await sendOTPVerificationEmail(
      forgetOTPCollection,
      email,
      res
    );

    return response;
  } catch (error) {
    res.send({
      status: "fail",
      message: "Failed to resend OTP",
    });
  }
};

const verifyForgetOTP = (forgetOTPCollection) => async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.send({
        status: "fail",
        message: "Empty details are not allowed",
      });
    }

    const forgetOTPRecords = await forgetOTPCollection
      .find({ email }, { projection: { _id: 0 } })
      .toArray();

    forgetOTPRecords.reverse();

    if (forgetOTPRecords.length <= 0) {
      return res.send({
        status: "fail",
        message: "There is no forget password request",
      });
    }

    const { expiresAt } = forgetOTPRecords[0];
    const hashedOTP = forgetOTPRecords[0]?.otp;

    if (expiresAt < Date.now()) {
      return res.send({
        status: "fail",
        message: "Forget OTP code has expired, please request again",
      });
    }

    const isValidOTP = await bcrypt.compare(otp, hashedOTP);

    if (!isValidOTP) {
      return res.send({
        status: "fail",
        message: "Forget OTP is invalid",
      });
    }

    res.send({
      status: "success",
      message: "Forget password request approve",
      isForgetOTPMatch: true,
    });
  } catch (error) {
    res.send({
      status: "fail",
      message:
        "User already verified or not exist, please register or log in 99",
      isForgetOTPMatch: false,
    });
  }
};

const updatePasswordByForgetOTP =
  (userCollection, forgetOTPCollection) => async (req, res) => {
    const { isForgetOTPMatch, email, newPassword } = req.body;
    try {
      if (!isForgetOTPMatch) {
        return res.send({
          status: "fail",
          message: "You cann't able to update password",
        });
      }

      if (newPassword.length < 8) {
        return res.send({
          status: "fail",
          message: "Password should have 8 characters",
        });
      }

      if (!validator.isStrongPassword(newPassword)) {
        return res.send({
          status: "fail",
          message:
            "Please add at least one lowercase, uppercase, numbers, and symbols",
        });
      }

      const newHashPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password with newHashPassword
      await userCollection.updateOne(
        { email },
        { $set: { password: newHashPassword, isVerified: true } }
      );

      await forgetOTPCollection.deleteMany({
        email,
      });

      res.send({
        status: "success",
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.send({
        status: "fail",
        message: "Failed to update password",
      });
    }
  };

module.exports = {
  registerUser,
  getAllUsers,
  getAUserByEmail,
  loginUser,
  changePassword,
  updateUserProfile,
  verifyOPT,
  resendOTP,
  forgetPassword,
  verifyForgetOTP,
  updatePasswordByForgetOTP,
};
