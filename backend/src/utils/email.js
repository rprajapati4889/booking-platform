const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify your email',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
};
