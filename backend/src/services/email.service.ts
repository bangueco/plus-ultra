import nodemailer from 'nodemailer'
import config from '../utils/config';

const sendVerificationEmail = (email: string, emailToken: string, username: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, 
    secure: false, 
    auth: {
      user: config.gmailUsername,
      pass: config.gmailPassword
    }
  });

  const mailOptions = {
    from: '"Plus Ultra" emailvalidatorcapstone@gmail.com',
    to: `${email}`,
    subject: 'Please verify your email',
    html:`<p>Hello ${username}, please verify your email address by clicking on this link!</p>
    <br>
    <a href="${config.url}/user/email/verify?username=${username}&emailToken=${emailToken}">Click here to verify</a>
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