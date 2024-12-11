// sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or another email service like Outlook
      port: 587, // Use 465 for SSL
      secure: false, // true for SSL
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
      html,
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
