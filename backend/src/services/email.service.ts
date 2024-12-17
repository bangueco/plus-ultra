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
    from: '"Plus Ultra Team" <justineivangueco2002@gmail.com>',
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
            }
            .container {
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
              background-color: #f9f9f9;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
            }
            h2 {
              color: #2c3e50;
            }
            a {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              text-decoration: none;
              color: #ffffff;
              background-color: #3498db;
              border-radius: 5px;
              font-weight: bold;
            }
            a:hover {
              background-color: #2980b9;
            }
            p {
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Email Verification</h2>
            <p>Hello <strong>${username}</strong>,</p>
            <p>
              Thank you for signing up with <strong>Plus Ultra</strong>. 
              Please verify your email address by clicking the button below:
            </p>
            <a href="${config.url}/user/email/verify?username=${username}&emailToken=${emailToken}">
              Verify Email Address
            </a>
            <p>If you did not create an account, please ignore this email.</p>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Plus Ultra. All rights reserved.
            </div>
          </div>
        </body>
      </html>
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