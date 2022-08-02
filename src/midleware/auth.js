const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config.json")
const ErrorResponse = require("../utils/errorResponse")

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("not uthorized to accesse this route", 401));
    }

    try {

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse("no user found with this id", 404));
        }

        req.user = user;

        next()
        
    } catch (err) {
        next(new ErrorResponse("not uthorized to accesse this route", 401))
    }
}