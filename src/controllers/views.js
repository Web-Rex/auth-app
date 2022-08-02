const path = require("path");
const axios = require("axios");

exports.home_page = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "public", "html", "index.html")
  );
};

exports.profile_page = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "public", "html", "profile.html")
  );
};

exports.validate_page = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "public", "html", "validate.html")
  );
};
