const { ObjectId } = require("mongodb");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const generateJWT = (_email) => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _email }, jwtKey);
};

const registerUser = (userCollection) => async (req, res) => {
  const { fullName, email, password } = req.body;
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
      email,
      password: hashPassword,
      jwtToken,
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
      user = await userCollection.findOne({ _id: new ObjectId(identifier) });
    } else {
      user = await userCollection.findOne({ email: identifier });
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
    // Optional checking
    if (!validator.isEmail(email)) {
      return res.send({
        status: "fail",
        message: "Invalid email format",
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

    //

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
        fullName: user?.fullName,
        email: user?.email,
        jwtToken: user?.jwtToken,
      },
    });
  } catch (error) {
    res.send({
      status: "fail",
      message: "Failed to login",
    });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getAUserByIdentifier,
  loginUser,
};
