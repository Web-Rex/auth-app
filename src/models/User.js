const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const config = require("../config/config.json")



const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "pleas provide a username"]
    },
    email: {
        type: String,
        required: [true, "pleas provide a email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "pleas provide a valid email"]
    },
    number: {
        type: Number,
        required: [true, "pleas provide a phone number"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false, // anytime we quary a user dont return the password
    },
    secret: {
        type: String,
        required: true,
        select: false, // anytime we quary a user dont return the secret
    },
    isverified: {
        type: Boolean,
        required: true,
        default: false,
        select: true, // anytime we quary a user dont return the secret
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    };

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);

    next();
})

UserSchema.methods.matchPasswords = async function (password)
{
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function () {
    return jwt.sign({id: this._id, number: this.number, isverified: this.isverified}, config.JWT_SECRET,
        {expiresIn: config.JWT_EXPIRES}
    )
}

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // 60 * 1000 = 1mn, * 10 = 10mn

    return resetToken;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;