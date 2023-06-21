const { ObjectId } = require("mongodb");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9a957c7f7a2343",
    pass: "5d7e3db066dc2e",
  },
});

const generateJWT = (_email) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _email }, jwtKey);
};

const registerUser = (userCollection, otpCollection) => async (req, res) => {
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

    // Send OTP for validation
    await sendOTPVerificationEmail(
      otpCollection,
      { _id: newUser?._id, email: newUser?.email },
      res
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

const getAUserByIdentifier = (userCollection) => async (req, res) => {
  const { identifier } = req.params;
  try {
    let user;
    if (ObjectId.isValid(identifier)) {
      user = await userCollection.findOne(
        { _id: new ObjectId(identifier) },
        { projection: { password: 0 } }
      );
    } else {
      user = await userCollection.findOne(
        { email: identifier },
        { projection: { password: 0 } }
      );
    }

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

const loginUser = (userCollection) => async (req, res) => {
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

    res.send({
      status: "success",
      data: {
        _id: user?._id,
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
  const { _id, oldPassword, newPassword } = req.body;

  try {
    const user = await userCollection.findOne({ _id: new ObjectId(_id) });
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
      { _id: user._id },
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
  const { id } = req.params;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };

  await userCollection.updateOne(filter, {
    $set: updatedData,
  });
  const user = await userCollection.findOne(filter);
  try {
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

// Verification

const sendOTPVerificationEmail = async (otpCollection, { _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: "salmanshah11062019@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `Please enter <b>${otp}</b> to verify your email`,
    };

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    await otpCollection.insertOne({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send({
          status: "fail",
          message: `Failed to send OTP on ${email}`,
        });
      } else {
        res.send({
          status: "success",
          message: `An OTP verification email has been sent on ${email}`,
          data: {
            userId: _id,
            email,
          },
        });
      }
    });
  } catch (error) {
    res.send({
      status: "fail",
      message: "Failed to send OTP",
    });
  }
};

//

module.exports = {
  registerUser,
  getAllUsers,
  getAUserByIdentifier,
  loginUser,
  changePassword,
  updateUserProfile,
};
