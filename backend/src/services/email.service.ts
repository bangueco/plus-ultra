import nodemailer from 'nodemailer'
import config from '../utils/config';

const sendVerificationEmail = (email: string, emailToken: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, 
    secure: false, 
    auth: {
      user: config.gmailUsername,
      pass: config.gmailPassword
    }
  });

  const mailOptions = {
    from: '"Plus Ultra!" debugmail@gmail.com',
    to: `${email}`,
    subject: 'Please verify your email...',
    html:`<p>Hello, verify your email address by clicking on this link!</p>
    <br>
    <a href="http://localhost:5173/verify-email?emailToken=${emailToken}">Click here to verify</a>
    `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else { 
      console.log('Email sent: ' + info.response);
    }
  });
}

export default {
  sendVerificationEmail
}