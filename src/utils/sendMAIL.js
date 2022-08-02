const nodemailer = require('nodemailer');
const config = require("../config/config.json")
const log = console.log;


const sendMail = (options) => {
    
// Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.GMAIL_FROM, // TODO: your gmail account
        pass: config.GMAIL_PASSWORD // TODO: your gmail password
    }
});

// Step 2
let mailOptions = {
    from: config.GMAIL_FROM, // TODO: email sender
    to: options.to, // TODO: email receiver
    subject: options.subject,
    text: options.to
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log(err);
    }
    return log('Email sent!!!');
});
}

module.exports = sendMail