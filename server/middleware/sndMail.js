import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 1. define the port first so we can check it
const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: port,
  // 2. secure must be TRUE for 465, and FALSE for 587
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async ({
  fullName,
  email,
  phone,
  subject,
  message,
}) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

  const htmlBody = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
    <p><strong>Subject:</strong> ${subject || "New Contact Message"}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  await transporter.sendMail({
    from: `"Website Contact" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Contact Form: ${subject || "New Message"}`,
    html: htmlBody,
    replyTo: email,
  });
};
