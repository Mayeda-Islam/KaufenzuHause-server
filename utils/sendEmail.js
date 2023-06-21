const bcrypt = require("bcrypt");
const saltRounds = 10;
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendOTPVerificationEmail = async (collection, email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `Please enter <b>${otp}</b> to verify your email`,
    };

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    await collection.insertOne({
      email: email,
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

module.exports = {
  sendOTPVerificationEmail,
};
