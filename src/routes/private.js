const express = require("express");
const { private } = require("../controllers/private")
const { protect } = require("../midleware/auth")
const PrivateRout = express.Router();


PrivateRout.route("/private").post(protect, private);



module.exports = PrivateRout