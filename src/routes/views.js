const express = require("express");
const { protect } = require("../midleware/auth")
const Views = express.Router();

const { 
    home_page,
    profile_page,
    validate_page
} = require("../controllers/views")


Views.route('/').get(home_page)
Views.route('/profile').get(profile_page)
Views.route('/validate').get(validate_page)

module.exports = Views;