import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ✅ Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider (Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS, // Your email password (set in .env)
  },
});

// ✅ Handle Contact Form Submission
export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Admin email to receive inquiries
      subject: `New Contact Request from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Contact request sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    res.status(500).json({ error: "Failed to send message. Try again later." });
  }
};
