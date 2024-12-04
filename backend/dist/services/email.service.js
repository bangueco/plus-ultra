"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../utils/config"));
const sendVerificationEmail = (email, emailToken, username) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.gmailUsername,
            pass: config_1.default.gmailPassword
        }
    });
    const mailOptions = {
        from: '"Plus Ultra" emailvalidatorcapstone@gmail.com',
        to: `${email}`,
        subject: 'Please verify your email',
        html: `<p>Hello ${username}, please verify your email address by clicking on this link!</p>
    <br>
    <a href="${config_1.default.url}/user/email/verify?username=${username}&emailToken=${emailToken}">Click here to verify</a>
    `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.default = {
    sendVerificationEmail
};
//# sourceMappingURL=email.service.js.map