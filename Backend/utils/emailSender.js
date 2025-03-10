import nodemailer from "nodemailer";
import { config } from "dotenv";
config();



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465", // true for port 465, false otherwise
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const send2FACode = async (email, code) => {

  // Email template with dynamic values
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
    }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .email-wrapper { background-color: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; }
    .email-header { padding: 30px; text-align: center; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }
    .logo-text { font-size: 24px; font-weight: 700; color: white; }
    .email-body { padding: 40px 30px; }
    h1 { color: #111827; font-size: 24px; font-weight: 700; margin-bottom: 20px; }
    .verification-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111827; padding: 20px; background: #f3f4f6; border-radius: 8px; display: inline-block; text-align: center; border: 1px dashed #d1d5db; }
    .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 25px 0; font-size: 14px; border-radius: 0 6px 6px 0; }
    .warning-box { background: #fff7ed; border-left: 4px solid #f97316; padding: 15px 20px; margin: 25px 0; font-size: 14px; border-radius: 0 6px 6px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #4f46e5; color:rgb(231, 231, 231); text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 15px; text-align: center; }
    .email-footer { padding: 25px 30px; text-align: center; font-size: 13px; color: #8e9196; background: #f9fafb; border-top: 1px solid #eef1f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="email-header">
        <div class="logo-text">3\`0.1Incorporated Real Estate</div>
      </div>
      <div class="email-body">
        <h1>Admin Verification Code</h1>
        <p>Hello, a login attempt was made to your admin account. Use the code below to verify it's you:</p>
        <div class="verification-code">${code}</div>
        <div class="info-box"><strong>Important:</strong> This code will expire in 15 minutes.</div>
        <div class="warning-box">If you didn't request this code, please contact our support team immediately.</div>
        <a href="#" class="button">Secure Your Account</a>
        <p>Thank you,<br><strong>3\`0.1Inc Security Team</strong></p>
      </div>
      <div class="email-footer">
        Need help? <a href="mailto:support@301Inc.com" style="color: #4f46e5; text-decoration: none;">Contact Support</a>
      </div>
    </div>
  </div>
</body>
</html>
`;



  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Admin Login Verification Code",
    text: `Your admin verification code is: ${code}\nThis code expires in 15 minutes.`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
