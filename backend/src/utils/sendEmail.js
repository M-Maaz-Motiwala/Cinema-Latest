// src/utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service like Outlook
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to,
      subject,
      text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
