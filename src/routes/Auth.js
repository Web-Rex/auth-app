const express = require("express");
const { protect } = require("../midleware/auth")
const Auth = express.Router();

const { 
    register, 
    login, 
    forgot_password, 
    reset_password,
    verify_number,
    send_code,
    setVerified
} = require("../controllers/Auth")


Auth.route("/register").post(register);

Auth.route("/login").post(login);

Auth.route("/forgotpassword").post(forgot_password);

Auth.route("/resetpassword/:user").put(reset_password);
Auth.route("/sendcode").post(protect, send_code);
Auth.route("/verifytoken").post(protect, verify_number);
Auth.route("/setverified").post(protect, setVerified);



module.exports = Auth