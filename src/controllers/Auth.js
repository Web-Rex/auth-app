const path = require("path");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse"); // for custom errors
const speakEasy = require("speakeasy");
const { sendSMS } = require("../utils/sendSMS");

exports.register = async (req, res, next) => {
  const { username, email, password, number } = req.body;

  try {
    const email_exist = await User.findOne({ email });

    if (email_exist)
      return res.json({
        success: false,
        error: "A user with this email exist",
      });

    const secret = speakEasy.generateSecret({ length: 20 });

    const user = await User.create({
      username,
      email,
      number,
      password,
      secret: secret.base32,
    });

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse("please provide email and password", 400));

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorResponse("invalid credentials", 401));

    const verify_password = await user.matchPasswords(password);

    if (!verify_password)
      return next(new ErrorResponse("invalid credentials", 401));

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgot_password = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorResponse("Email not found", 404));

    const resetToken = user.getResetPasswordToken();

    if (!resetToken)
      return next(new ErrorResponse("problem with resetPasswordToken", 404));

    await user.save();

    const resetURL = `http://localhost:5000/passwordreset/${resetToken}`;

    const message = `
            <h1>You requested a password reset</h1>
            <p>Click the link bellow to reset your password</p>
            <a href=${resetURL} clicktracking=off>${resetURL}</a>
        `;

    try {
    } catch (error) {}
  } catch (error) {
    next(error);
  }
};

exports.reset_password = (req, res, next) => {
  res.send("reset password page");
};

// function to send token
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();

  res.status(statusCode).json({ success: true, token });
};

/**********************************************************/

exports.verify_number = async (req, res, next) => {
    const { token } = req.body;

    if (!token) return next(new ErrorResponse("all field required", 404));

    const user = await User.findOne({ number: req.user.number }).select("+secret").catch(err => {return res.send(err.message)});


    const validate = speakEasy.totp.verify({
        secret: user.secret,
        encoding: "base32",
        token: token,
        window: 0
    })


    res.send({
        valid: validate
    })
};

exports.send_code = async (req, res, next) => {
  const num = req.user.number;

  try {
    const user = await User.findOne({ number: num }).select("+secret");
    

    const token = speakEasy.totp({
      secret: user.secret,
      encoding: "base32",
    });

    const options = {
      text: `this is the code you requested ${token}`,
      number: user.number,
    };

    // await sendSMS(options);

    res.json({
      token,
      time: (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
    });

  } catch (error) {
    res.send(error);
  }
};

exports.setVerified = async (req, res, next) => {
  const num = req.user.number;

  try {
    const user = await User.findOne({ number: num }).catch(err => {return res.send(err.message)});
    
    user.isverified = true

    await user.save().catch(err => {return res.send(err.message)});
    
    res.send({
      success: true,
      user
    })
  } catch (error) {
    res.send(error);
  }
};
